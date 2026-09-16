import { describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import NewPatient from '@/views/NewPatient.vue';
import { Provided } from '@/lib/provided';
import { left, right } from '@/lib/shared/either';
import type { PatientSearchResultModel } from '@/lib/models/patient';

const OWNER = { ownerId: 'OWN1', name: 'Ana Tutor', phoneNumber: '923000000', whatsapp: false };
const HOSPITALIZATION = {
    weight: 12.5,
    complaints: ['Anorexia'],
    diagnostics: ['Por Definir'],
    entryDate: '2025-11-20',
    dischargeDate: ''
};
const BUDGET = { startOn: '2025-11-20', endOn: '2025-11-27', status: 'NÃO PAGO' };

const SELECTABLE: PatientSearchResultModel = {
    systemId: 'sys-A',
    patientId: '10340A',
    patientName: 'Loki',
    ownerId: 'OWN1',
    ownerName: 'Ana Tutor',
    specie: 'CANINO',
    breed: 'Akita',
    birthDate: '2012-11-11',
    status: 'ALTA MEDICA'
};

const HOSPITALIZED: PatientSearchResultModel = { ...SELECTABLE, systemId: 'sys-H', status: 'HOSPITALIZADO' };

class FakePatientService {
    readonly searchCalls: { term: string; resolve: (value: unknown) => void }[] = [];
    readonly calls: { method: string; args: unknown[] }[] = [];

    searchPatients(term: string): Promise<unknown> {
        return new Promise((resolve) => this.searchCalls.push({ term, resolve }));
    }

    searchPatient() {
        return Promise.resolve(left({ status: 404, message: 'Paciente não encontrado' }));
    }

    newPatient(args: unknown) {
        this.calls.push({ method: 'newPatient', args: [args] });
        return Promise.resolve(right(undefined));
    }

    newHospitalization(...args: unknown[]) {
        this.calls.push({ method: 'newHospitalization', args });
        return Promise.resolve(right(undefined));
    }
}

function makeOwnerFormStub(findOwnerCalls: string[], clearCalls: { count: number }) {
    return defineComponent({
        name: 'OwnerForm',
        emits: ['owner', 'pending'],
        setup(_, { emit, expose }) {
            expose({
                clear() {
                    clearCalls.count++;
                    emit('owner', { ownerId: '', name: '', phoneNumber: '', whatsapp: false });
                },
                findOwner(ownerId: string) {
                    findOwnerCalls.push(ownerId);
                    emit('owner', { ...OWNER, ownerId });
                },
                ownerChange() {
                    return undefined;
                }
            });
            emit('owner', OWNER);
            return () => h('div');
        }
    });
}

function makeHospitalizationFormStub() {
    return defineComponent({
        name: 'HospitalizationForm',
        emits: ['hospitalization'],
        setup(_, { emit, expose }) {
            expose({ clear() {} });
            emit('hospitalization', HOSPITALIZATION);
            return () => h('div');
        }
    });
}

function makeBudgetFormStub() {
    return defineComponent({
        name: 'BudgetForm',
        emits: ['budget'],
        setup(_, { emit }) {
            emit('budget', BUDGET);
            return () => h('div');
        }
    });
}

const waitDebounce = () => new Promise((resolve) => setTimeout(resolve, 330));

interface Harness {
    wrapper: VueWrapper;
    service: FakePatientService;
    findOwnerCalls: string[];
    clearCalls: { count: number };
}

function mountView(): Harness {
    const service = new FakePatientService();
    const findOwnerCalls: string[] = [];
    const clearCalls = { count: 0 };

    const wrapper = mount(NewPatient, {
        global: {
            provide: {
                [Provided.PatientService]: service,
                [Provided.CrmService]: { getOwners: () => Promise.resolve([]) }
            },
            stubs: {
                Header: true,
                GoBack: true,
                OwnerForm: makeOwnerFormStub(findOwnerCalls, clearCalls),
                HospitalizationForm: makeHospitalizationFormStub(),
                BudgetForm: makeBudgetFormStub()
            }
        }
    });

    return { wrapper, service, findOwnerCalls, clearCalls };
}

function searchInput(wrapper: VueWrapper) {
    return wrapper.find('input[placeholder="Pesquisar por ID ou nome (paciente/tutor)"]');
}

function nameField(wrapper: VueWrapper) {
    return wrapper.find('input[placeholder="Nome do Paciente"]').element as HTMLInputElement;
}

function hospitalizarButton(wrapper: VueWrapper) {
    return wrapper.findAll('button').find((button) => button.text().includes('Hospitalizar'))!;
}

async function selectResult(harness: Harness) {
    const { wrapper, service } = harness;

    await searchInput(wrapper).setValue('loki');
    await waitDebounce();
    service.searchCalls[service.searchCalls.length - 1].resolve(right([SELECTABLE]));
    await flushPromises();

    await wrapper.find('[data-search-system-id="sys-A"]').trigger('click');
    await flushPromises();
}

describe('nova hospitalização - pesquisa unificada', () => {
    it('seleccionar um paciente preenche, bloqueia e carrega o tutor', async () => {
        const harness = mountView();

        await selectResult(harness);

        expect(nameField(harness.wrapper).value).toBe('Loki');
        expect(nameField(harness.wrapper).disabled).toBe(true);
        expect(harness.findOwnerCalls).toContain('OWN1');
    });

    it('hospitaliza o paciente seleccionado pelo systemId (não cria duplicado)', async () => {
        const harness = mountView();

        await selectResult(harness);

        await hospitalizarButton(harness.wrapper).trigger('click');
        await flushPromises();

        expect(harness.service.calls).toHaveLength(1);
        expect(harness.service.calls[0].method).toBe('newHospitalization');
        expect(harness.service.calls[0].args[0]).toBe('sys-A');
    });

    it('um resultado já internado não é seleccionável', async () => {
        const harness = mountView();
        const { wrapper, service } = harness;

        await searchInput(wrapper).setValue('mel');
        await waitDebounce();
        service.searchCalls[0].resolve(right([HOSPITALIZED]));
        await flushPromises();

        await wrapper.find('[data-search-system-id="sys-H"]').trigger('click');
        await flushPromises();

        expect(nameField(wrapper).value).toBe('');
        expect(harness.findOwnerCalls).toHaveLength(0);
    });

    it('editar o termo invalida a selecção e desbloqueia o formulário', async () => {
        const harness = mountView();

        await selectResult(harness);
        expect(nameField(harness.wrapper).disabled).toBe(true);

        await searchInput(harness.wrapper).setValue('loki x');
        await flushPromises();

        expect(nameField(harness.wrapper).disabled).toBe(false);
        expect(harness.clearCalls.count).toBeGreaterThan(0);
    });

    it('"Criar novo paciente" desbloqueia sem apagar um rascunho anterior à pesquisa', async () => {
        const harness = mountView();
        const { wrapper } = harness;

        // Rascunho de paciente novo (sem qualquer selecção pelo meio).
        await wrapper.find('input[placeholder="Nome do Paciente"]').setValue('Bolinha');

        // Escrever na pesquisa sem seleccionar não pode apagar o rascunho.
        await searchInput(wrapper).setValue('lo');
        await flushPromises();
        expect(nameField(wrapper).value).toBe('Bolinha');
        expect(nameField(wrapper).disabled).toBe(false);
    });

    it('uma selecção explícita bloqueia o ID Paciente (não pode ser trocado localmente)', async () => {
        const harness = mountView();

        await selectResult(harness);

        const idField = harness.wrapper.find('input[placeholder="ID do Paciente"]');
        expect((idField.element as HTMLInputElement).value).toBe('10340A');
        expect((idField.element as HTMLInputElement).disabled).toBe(true);

        // Editar a pesquisa invalida a selecção e volta a permitir o ID.
        await searchInput(harness.wrapper).setValue('loki x');
        await flushPromises();

        expect((idField.element as HTMLInputElement).disabled).toBe(false);
        expect((idField.element as HTMLInputElement).value).toBe('');
    });

    it('após hospitalizar com sucesso não sobra termo, selecção nem paciente', async () => {
        const harness = mountView();
        const { wrapper } = harness;

        await selectResult(harness);
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(harness.service.calls).toHaveLength(1);

        const idField = wrapper.find('input[placeholder="ID do Paciente"]');
        expect((searchInput(wrapper).element as HTMLInputElement).value).toBe('');
        expect(wrapper.findAll('[data-search-system-id]')).toHaveLength(0);
        expect((idField.element as HTMLInputElement).value).toBe('');
        expect((idField.element as HTMLInputElement).disabled).toBe(false);
        expect(nameField(wrapper).value).toBe('');

        // O paciente anterior já não pode ser resubmetido.
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(harness.service.calls).toHaveLength(1);
    });
});
