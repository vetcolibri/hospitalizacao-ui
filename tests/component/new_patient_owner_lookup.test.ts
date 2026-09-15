import { beforeAll, describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import NewPatient from '@/views/NewPatient.vue';
import { Provided } from '@/lib/provided';
import { left, right, type Either } from '@/lib/shared/either';
import type { ApiError } from '@/lib/apiClient/api_error';
import type { OwnerModel } from '@/lib/models/owner';

// O jsdom 22 não implementa showModal/close e o myAlert usa-os para mostrar o diálogo.
beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
});

const PATIENT_A = {
    systemId: 'sys-A',
    patientId: '10340A',
    name: 'Loki',
    specie: 'CANINO',
    breed: 'Akita',
    status: 'ALTA MEDICA',
    birthDate: '2012-11-11',
    age: ' 13 anos',
    ownerId: 'OWN1'
};

const PATIENT_B = {
    ...PATIENT_A,
    systemId: 'sys-B',
    patientId: '10827A',
    name: 'Bonita',
    ownerId: 'OWN2'
};

const OWNER_A: OwnerModel = {
    ownerId: 'OWN1',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
    whatsapp: true
};

const OWNER_B: OwnerModel = {
    ownerId: 'OWN2',
    name: 'Maria Silva',
    phoneNumber: '923456789',
    whatsapp: false
};

const HOSPITALIZATION = {
    weight: 12.5,
    complaints: ['Anorexia / inaptencia'],
    diagnostics: ['Por Definir'],
    entryDate: '2025-11-20',
    dischargeDate: ''
};

const BUDGET = {
    startOn: '2025-11-20',
    endOn: '2025-11-27',
    status: 'NÃO PAGO'
};

class ControlledPatientService {
    readonly searches: { patientId: string; resolve: (patient: unknown) => void }[] = [];
    readonly calls: { method: string; args: unknown[] }[] = [];

    searchPatient(patientId: string): Promise<unknown> {
        return new Promise((resolve) => {
            this.searches.push({
                patientId,
                resolve: (patient) => resolve(right(patient))
            });
        });
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

class ControlledCrmService {
    readonly lookups: {
        ownerId: string;
        resolve: (owner: OwnerModel) => void;
        rejectAsMissing: () => void;
        fail: (error: ApiError) => void;
    }[] = [];
    bulkLoads = 0;

    getOwners(): Promise<OwnerModel[]> {
        this.bulkLoads++;
        return Promise.resolve([]);
    }

    findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>> {
        return new Promise((resolve) => {
            this.lookups.push({
                ownerId,
                resolve: (owner) => resolve(right(owner)),
                rejectAsMissing: () =>
                    resolve(left({ status: 404, message: 'O tutor não foi encontrado.' })),
                fail: (error: ApiError) => resolve(left(error))
            });
        });
    }
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

function mountForm(
    patientService: ControlledPatientService,
    crmService: ControlledCrmService
): VueWrapper {
    return mount(NewPatient, {
        global: {
            provide: {
                [Provided.PatientService]: patientService,
                [Provided.CrmService]: crmService
            },
            stubs: {
                Header: true,
                GoBack: true,
                HospitalizationForm: makeHospitalizationFormStub(),
                BudgetForm: makeBudgetFormStub()
            }
        }
    });
}

function ownerInput(wrapper: VueWrapper, field: string): HTMLInputElement {
    return wrapper.find(`[data-field="${field}"] input`).element as HTMLInputElement;
}

function hospitalizarButton(wrapper: VueWrapper) {
    return wrapper.findAll('button').find((button) => button.text().includes('Hospitalizar'))!;
}

function alertDialog(): HTMLElement | null {
    return document.body.querySelector('dialog.my-alert');
}

/** O utilizador preenche o tutor enquanto a pesquisa ainda decorre. */
async function fillOwnerByHand(wrapper: VueWrapper) {
    await wrapper.find('[data-field="ownerData.name"] input').setValue('Tutor Escrito');
    await wrapper.find('[data-field="ownerData.phoneNumber"] input').setValue('923456789');
}

describe('tutor do paciente seleccionado', () => {
    it('carrega o tutor por lookup directo e só deixa hospitalizar depois de ele chegar', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');

        // A pesquisa do paciente termina antes da pesquisa do tutor.
        patientService.searches[0].resolve(PATIENT_A);
        await flushPromises();

        expect(crmService.lookups.map((lookup) => lookup.ownerId)).toEqual(['OWN1']);
        expect(crmService.bulkLoads).toBe(0);
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeDefined();

        // Mesmo com o formulário válido, o tutor pendente bloqueia a hospitalização.
        await fillOwnerByHand(wrapper);
        expect((wrapper.find('form').element as HTMLFormElement).checkValidity()).toBe(true);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(patientService.calls).toEqual([]);

        // O tutor chega: nome, telefone e WhatsApp preenchidos e bloqueados.
        crmService.lookups[0].resolve(OWNER_A);
        await flushPromises();

        expect(ownerInput(wrapper, 'ownerData.ownerId').value).toBe('OWN1');
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('Yoan Fowas');
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').value).toBe('998210817');
        expect(ownerInput(wrapper, 'ownerData.name').disabled).toBe(true);
        expect(wrapper.text()).toContain('Proprietário tem WhatsApp.');
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeUndefined();

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].method).toBe('newHospitalization');
        expect(patientService.calls[0].args[0]).toBe('sys-A');
    });

    it('não atribui o tutor do paciente anterior ao paciente seguinte', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');
        patientService.searches[0].resolve(PATIENT_A);
        await flushPromises();
        crmService.lookups[0].resolve(OWNER_A);
        await flushPromises();
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('Yoan Fowas');

        // O utilizador muda para outro paciente: a pesquisa do tutor de B fica pendente.
        await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10827A');
        patientService.searches[1].resolve(PATIENT_B);
        await flushPromises();

        expect(crmService.lookups.map((lookup) => lookup.ownerId)).toEqual(['OWN1', 'OWN2']);
        expect(ownerInput(wrapper, 'ownerData.ownerId').value).toBe('OWN2');
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('');

        // Uma resposta atrasada do tutor de A não pode preencher o formulário de B.
        crmService.lookups[0].resolve(OWNER_A);
        await flushPromises();
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('');

        // Mesmo com o formulário válido à mão, não se hospitaliza B antes do tutor de B.
        await fillOwnerByHand(wrapper);
        expect((wrapper.find('form').element as HTMLFormElement).checkValidity()).toBe(true);
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(patientService.calls).toEqual([]);

        crmService.lookups[1].resolve(OWNER_B);
        await flushPromises();
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('Maria Silva');
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').value).toBe('923456789');
        expect(wrapper.text()).toContain('Proprietário não tem WhatsApp.');

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].args[0]).toBe('sys-B');
    });

    it('trata o tutor como novo apenas quando a API responde 404', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');
        patientService.searches[0].resolve(PATIENT_A);
        await flushPromises();

        crmService.lookups[0].rejectAsMissing();
        await flushPromises();

        // Tutor novo: campos editáveis e submissão permitida depois de preenchidos.
        expect(alertDialog()).toBeNull();
        expect(ownerInput(wrapper, 'ownerData.name').disabled).toBe(false);
        expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);

        await fillOwnerByHand(wrapper);
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeUndefined();
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].method).toBe('newHospitalization');
        expect(patientService.calls[0].args[0]).toBe('sys-A');
    });

    it('não trata uma falha de autorização ou transitória como tutor novo', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');
        patientService.searches[0].resolve(PATIENT_A);
        await flushPromises();

        crmService.lookups[0].fail({ status: 403, message: 'Sem permissão' });
        await flushPromises();

        expect(alertDialog()?.textContent).toContain('Erro ao procurar o tutor');
        expect(alertDialog()?.textContent).toContain('Sem permissão');
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeDefined();

        await fillOwnerByHand(wrapper);
        expect((wrapper.find('form').element as HTMLFormElement).checkValidity()).toBe(true);
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(patientService.calls).toEqual([]);
    });
});
