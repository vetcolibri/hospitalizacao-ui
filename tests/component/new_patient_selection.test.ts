import { describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import NewPatient from '@/views/NewPatient.vue';
import { Provided } from '@/lib/provided';
import { left, right } from '@/lib/shared/either';

const OWNER = {
    ownerId: '10340A',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
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

const PATIENT_A = {
    systemId: 'sys-A',
    patientId: '10340A',
    name: 'Loki',
    specie: 'CANINO',
    breed: 'Akita',
    status: 'ALTA MEDICA',
    birthDate: '2012-11-11',
    age: ' 13 anos',
    ownerId: '10340A'
};

const PATIENT_B = { ...PATIENT_A, systemId: 'sys-B', patientId: '10340B', name: 'Mel' };

class ControlledPatientService {
    readonly searches: {
        patientId: string;
        resolve: (patient: unknown) => void;
        rejectAsMissing: () => void;
    }[] = [];
    readonly calls: { method: string; args: unknown[] }[] = [];

    searchPatient(patientId: string): Promise<unknown> {
        return new Promise((resolve) => {
            this.searches.push({
                patientId,
                resolve: (patient) => resolve(right(patient)),
                rejectAsMissing: () => resolve(left({ status: 404, message: 'Paciente não encontrado' }))
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

function makeOwnerFormStub() {
    return defineComponent({
        name: 'OwnerForm',
        emits: ['owner'],
        setup(_, { emit, expose }) {
            expose({ clear() {}, findOwner() {} });
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

function mountForm(service: ControlledPatientService): VueWrapper {
    return mount(NewPatient, {
        global: {
            provide: {
                [Provided.PatientService]: service,
                [Provided.CrmService]: { getOwners: () => Promise.resolve([]) }
            },
            stubs: {
                Header: true,
                GoBack: true,
                OwnerForm: makeOwnerFormStub(),
                HospitalizationForm: makeHospitalizationFormStub(),
                BudgetForm: makeBudgetFormStub()
            }
        }
    });
}

function field(wrapper: VueWrapper, placeholder: string) {
    return wrapper.find(`input[placeholder="${placeholder}"]`).element as HTMLInputElement;
}

function hospitalizarButton(wrapper: VueWrapper) {
    return wrapper.findAll('button').find((button) => button.text().includes('Hospitalizar'))!;
}

async function fillNewPatient(wrapper: VueWrapper) {
    await wrapper.find('input[placeholder="Nome do Paciente"]').setValue('Bolinha');
    await wrapper.find('select').setValue('CANINO');
    await wrapper.find('[data-field="patientData.breed"] .absolute').trigger('click');
    await wrapper.findAll('[data-field="patientData.breed"] li')[0].trigger('click');
}

describe('nova hospitalização de um paciente já existente', () => {
    it('não hospitaliza o paciente anterior quando o ID muda antes da resposta da pesquisa', async () => {
        const service = new ControlledPatientService();
        const wrapper = mountForm(service);
        const form = wrapper.find('form').element as HTMLFormElement;
        const idField = wrapper.find('input[placeholder="ID do Paciente"]');

        await idField.setValue('10340A');
        expect(service.searches.map((search) => search.patientId)).toEqual(['10340A']);

        service.searches[0].resolve(PATIENT_A);
        await flushPromises();

        expect(field(wrapper, 'Nome do Paciente').value).toBe('Loki');
        expect(form.checkValidity()).toBe(true);

        // O utilizador muda para outro ID: a pesquisa de B fica pendente.
        await idField.setValue('10340B');
        expect(service.searches.map((search) => search.patientId)).toEqual(['10340A', '10340B']);

        // Submeter neste intervalo não pode hospitalizar A nem criar B.
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();
        expect(service.calls).toEqual([]);
        expect(form.checkValidity()).toBe(true);
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeDefined();

        service.searches[1].resolve(PATIENT_B);
        await flushPromises();

        expect(field(wrapper, 'Nome do Paciente').value).toBe('Mel');
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeUndefined();

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(service.calls).toHaveLength(1);
        expect(service.calls[0].method).toBe('newHospitalization');
        expect(service.calls[0].args[0]).toBe('sys-B');
    });

    it('regista um paciente novo quando o ID pesquisado não existe', async () => {
        const service = new ControlledPatientService();
        const wrapper = mountForm(service);
        const idField = wrapper.find('input[placeholder="ID do Paciente"]');

        await idField.setValue('10340A');
        service.searches[0].resolve(PATIENT_A);
        await flushPromises();
        expect(field(wrapper, 'Nome do Paciente').disabled).toBe(true);

        // Mudar o ID invalida de imediato o paciente seleccionado.
        await idField.setValue('10340C');
        expect(field(wrapper, 'Nome do Paciente').disabled).toBe(false);
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeDefined();

        service.searches[1].rejectAsMissing();
        await flushPromises();
        expect(hospitalizarButton(wrapper).attributes('disabled')).toBeUndefined();

        await fillNewPatient(wrapper);
        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(service.calls).toHaveLength(1);
        expect(service.calls[0].method).toBe('newPatient');
        expect(service.calls[0].args[0]).toMatchObject({ patientData: { patientId: '10340C' } });
    });
});
