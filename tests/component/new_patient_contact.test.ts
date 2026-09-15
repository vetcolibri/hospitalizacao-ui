import { beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import NewPatient from '@/views/NewPatient.vue';
import { Provided } from '@/lib/provided';
import { left, right, type Either } from '@/lib/shared/either';
import type { ApiError } from '@/lib/apiClient/api_error';
import type { OwnerModel } from '@/lib/models/owner';

beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
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

const BUDGET = {
    startOn: '2025-11-20',
    endOn: '2025-11-27',
    status: 'NÃO PAGO'
};

const CONTACT = { name: 'Maria José', phoneNumber: '923456789', whatsapp: true };

const HOSPITALIZATION = {
    weight: 12.5,
    complaints: ['Anorexia'],
    diagnostics: ['Por Definir'],
    entryDate: '2025-11-20',
    dischargeDate: '',
    contact: CONTACT
};

class ControlledPatientService {
    readonly searches: { patientId: string; resolve: (patient: unknown) => void }[] = [];
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

    getOwners(): Promise<OwnerModel[]> {
        return Promise.resolve([]);
    }

    findOwner(ownerId: string): Promise<Either<ApiError, OwnerModel>> {
        return new Promise((resolve) => {
            this.lookups.push({ ownerId, resolve: (owner) => resolve(right(owner)) });
        });
    }
}

const clearSpy = vi.fn();

function makeHospitalizationFormStub() {
    return defineComponent({
        name: 'HospitalizationForm',
        emits: ['hospitalization'],
        setup(_, { emit, expose }) {
            const contact = ref({ ...CONTACT });
            expose({ clear: clearSpy });
            emit('hospitalization', HOSPITALIZATION);
            return () =>
                h('div', [
                    h('input', {
                        'data-field': 'hospitalizationData.contact.name',
                        value: contact.value.name,
                        onInput: (event: Event) => {
                            contact.value.name = (event.target as HTMLInputElement).value;
                        }
                    }),
                    h('input', {
                        'data-field': 'hospitalizationData.contact.phoneNumber',
                        value: contact.value.phoneNumber,
                        onInput: (event: Event) => {
                            contact.value.phoneNumber = (event.target as HTMLInputElement).value;
                        }
                    })
                ]);
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

function mountForm(patientService: ControlledPatientService, crmService: ControlledCrmService) {
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

function hospitalizarButton(wrapper: VueWrapper) {
    return wrapper.findAll('button').find((button) => button.text().includes('Hospitalizar'))!;
}

async function selectPatient(
    wrapper: VueWrapper,
    patientService: ControlledPatientService,
    crmService: ControlledCrmService
) {
    await wrapper.find('input[placeholder="ID do Paciente"]').setValue(PATIENT.patientId);
    patientService.searches[0].resolve(PATIENT);
    await flushPromises();
    crmService.lookups[0].resolve(OWNER);
    await flushPromises();
}

describe('contacto específico na nova hospitalização', () => {
    it('envia o contacto da hospitalização no pedido', async () => {
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatient(wrapper, patientService, crmService);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(patientService.calls).toHaveLength(1);
        expect(patientService.calls[0].method).toBe('newHospitalization');
        expect(patientService.calls[0].args[1]).toEqual(HOSPITALIZATION);
    });

    it('ao falhar preserva o contacto e associa o erro ao campo', async () => {
        clearSpy.mockClear();
        const patientService = new ControlledPatientService();
        patientService.hospitalizationResult = left({
            status: 400,
            message: 'Corrija os campos indicados.',
            errors: [
                {
                    code: 'invalid_string',
                    path: 'hospitalizationData.contact.phoneNumber',
                    message: 'Insira um número de telefone angolano válido.'
                }
            ]
        });
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatient(wrapper, patientService, crmService);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        const field = wrapper.find('[data-field="hospitalizationData.contact.phoneNumber"]')
            .element as HTMLInputElement;

        expect(field.validationMessage).toContain('telefone angolano');
        expect(clearSpy).not.toHaveBeenCalled();
    });

    it('ao recusar o nome do contacto preserva os dados e associa o erro ao campo', async () => {
        clearSpy.mockClear();
        const patientService = new ControlledPatientService();
        patientService.hospitalizationResult = left({
            status: 400,
            message: 'Corrija os campos indicados.',
            errors: [
                {
                    code: 'too_big',
                    path: 'hospitalizationData.contact.name',
                    message: 'O nome do contacto não pode ter mais de 50 caracteres.'
                }
            ]
        });
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatient(wrapper, patientService, crmService);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        const field = wrapper.find('[data-field="hospitalizationData.contact.name"]')
            .element as HTMLInputElement;

        expect(field.validationMessage).toContain('50 caracteres');
        expect(clearSpy).not.toHaveBeenCalled();
    });

    it('ao ter sucesso limpa a excepção do formulário', async () => {
        clearSpy.mockClear();
        const patientService = new ControlledPatientService();
        const crmService = new ControlledCrmService();
        const wrapper = mountForm(patientService, crmService);

        await selectPatient(wrapper, patientService, crmService);

        await hospitalizarButton(wrapper).trigger('click');
        await flushPromises();

        expect(clearSpy).toHaveBeenCalled();
    });
});
