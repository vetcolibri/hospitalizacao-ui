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
    // O jsdom 22 não expõe CSS.escape, usado para mapear erros por campo.
    (globalThis as unknown as { CSS?: { escape: (value: string) => string } }).CSS ??= {
        escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
    };
});

const PATIENT = {
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

const OWNER: OwnerModel = {
    ownerId: 'OWN1',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
    whatsapp: true
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
    readonly searches: {
        patientId: string;
        resolve: (patient: unknown) => void;
    }[] = [];
    readonly calls: { method: string; args: unknown[] }[] = [];
    hospitalizationResult: Either<ApiError, void> = right(undefined);

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
        return Promise.resolve(this.hospitalizationResult);
    }
}

class ControlledCrmService {
    readonly lookups: { ownerId: string; resolve: (owner: OwnerModel) => void }[] = [];
    bulkLoads = 0;

    getOwners(): Promise<OwnerModel[]> {
        this.bulkLoads++;
        return Promise.resolve([]);
    }

    findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>> {
        return new Promise((resolve) => {
            this.lookups.push({
                ownerId,
                resolve: (owner) => resolve(right(owner))
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

function whatsappInput(wrapper: VueWrapper) {
    return wrapper.find('[data-field="ownerData.whatsapp"]');
}

function hospitalizarButton(wrapper: VueWrapper) {
    return wrapper.findAll('button').find((button) => button.text().includes('Hospitalizar'))!;
}

async function selectPatientWithOwner(
    wrapper: VueWrapper,
    patientService: ControlledPatientService,
    crmService: ControlledCrmService,
    owner: OwnerModel = OWNER
) {
    await wrapper.find('input[placeholder="ID do Paciente"]').setValue(PATIENT.patientId);
    patientService.searches[0].resolve(PATIENT);
    await flushPromises();
    crmService.lookups[0].resolve(owner);
    await flushPromises();
}

describe('edição do tutor durante a nova hospitalização', () => {
    it('permite corrigir nome, telefone e WhatsApp e envia a edição na hospitalização', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatientWithOwner(wrapper, patientService, crmService);

        // A ficha geral do tutor é editável e o formulário avisa que a alteração é global.
        expect(ownerInput(wrapper, 'ownerData.name').disabled).toBe(false);
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').disabled).toBe(false);
        expect(whatsappInput(wrapper).element.disabled).toBe(false);
        expect(wrapper.text()).toContain('actualiza a ficha geral do tutor');

        await wrapper.find('[data-field="ownerData.name"] input').setValue('Yoan Fowas Novo');
        await wrapper.find('[data-field="ownerData.phoneNumber"] input').setValue('923456789');
        await whatsappInput(wrapper).setValue(false);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].method).toBe('newHospitalization');
        expect(patientService.calls[0].args).toEqual([
            'sys-A',
            HOSPITALIZATION,
            BUDGET,
            {
                ownerId: 'OWN1',
                name: 'Yoan Fowas Novo',
                phoneNumber: '923456789',
                whatsapp: false
            }
        ]);
    });

    it('não envia edição quando o tutor não foi alterado', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatientWithOwner(wrapper, patientService, crmService);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].args[3]).toBeUndefined();
    });

    it('valida o telefone angolano no cliente e não perde os dados', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatientWithOwner(wrapper, patientService, crmService);

        await wrapper.find('[data-field="ownerData.phoneNumber"] input').setValue('12345');
        const form = wrapper.find('form').element as HTMLFormElement;
        expect(form.checkValidity()).toBe(false);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toEqual([]);
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').value).toBe('12345');
    });

    it('exige o nome do tutor preenchido', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatientWithOwner(wrapper, patientService, crmService);

        await wrapper.find('[data-field="ownerData.name"] input').setValue('');
        const form = wrapper.find('form').element as HTMLFormElement;
        expect(form.checkValidity()).toBe(false);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toEqual([]);
    });

    it('mostra o erro por campo devolvido pelo servidor sem perder a edição', async () => {
        const patientService = new ControlledPatientService();
        patientService.hospitalizationResult = left({
            status: 400,
            message: 'Corrija os campos indicados.',
            errors: [
                {
                    code: 'invalid_string',
                    path: 'ownerData.phoneNumber',
                    message: 'Insira um número de telefone angolano válido.'
                }
            ]
        });
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatientWithOwner(wrapper, patientService, crmService);

        await wrapper.find('[data-field="ownerData.name"] input').setValue('Yoan Editado');
        await wrapper.find('[data-field="ownerData.phoneNumber"] input').setValue('923456789');

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toHaveLength(1);
        // Os dados editados mantêm-se no formulário para o utilizador corrigir.
        expect(ownerInput(wrapper, 'ownerData.name').value).toBe('Yoan Editado');
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').value).toBe('923456789');
        expect(ownerInput(wrapper, 'ownerData.phoneNumber').validationMessage).toContain(
            'telefone angolano'
        );
    });
});
