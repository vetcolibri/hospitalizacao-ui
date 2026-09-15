import { beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PatientSummary from '@/components/patients/PatientSummary.vue';
import { Provided } from '@/lib/provided';
import type { HospitalizationModel } from '@/lib/models/hospitalization';
import type { OwnerModel } from '@/lib/models/owner';
import type { PatientModel } from '@/lib/models/patient';

beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
});

const PATIENT: PatientModel = {
    systemId: 'sys-A',
    patientId: '10340A',
    name: 'Loki',
    specie: 'CANINO',
    breed: 'Akita',
    status: 'HOSPITALIZADO',
    birthDate: '2012-11-11',
    age: '13 anos',
    ownerId: 'OWN1'
};

const OWNER: OwnerModel = {
    ownerId: 'OWN1',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
    whatsapp: true
};

const BASE_HOSPITALIZATION: HospitalizationModel = {
    hospitalizationId: 'hosp-1',
    patientId: 'sys-A',
    weight: 12.5,
    status: 'Aberta',
    complaints: ['Anorexia'],
    diagnostics: ['Por Definir'],
    entryDate: '2026-01-01T10:00:00.000Z',
    dischargeDate: '2026-01-10T10:00:00.000Z'
};

const EXCEPTION = { name: 'Maria José', phoneNumber: '923456789', whatsapp: false };

function mountSummary(hospitalization: HospitalizationModel) {
    return mount(PatientSummary, {
        props: {
            patient: PATIENT,
            owner: OWNER,
            hospitalization,
            budget: undefined
        },
        global: {
            provide: {
                [Provided.PatientService]: { endBudget: () => Promise.resolve() }
            }
        }
    });
}

describe('detalhes mostram o contacto efectivo da hospitalização', () => {
    it('sem excepção mostra o tutor principal como contacto usado', () => {
        const wrapper = mountSummary(BASE_HOSPITALIZATION);
        const text = wrapper.text();

        expect(text).toContain('Tutor principal');
        expect(text).toContain(OWNER.name);
        expect(text).toContain(OWNER.phoneNumber);
    });

    it('com excepção mostra o contacto guardado no episódio, não o tutor', () => {
        const wrapper = mountSummary({ ...BASE_HOSPITALIZATION, contact: EXCEPTION });
        const text = wrapper.text();

        expect(text).toContain('Contacto específico desta hospitalização');
        expect(text).toContain(EXCEPTION.name);
        expect(text).toContain(EXCEPTION.phoneNumber);

        // O bloco do contacto usado não pode cair no telefone do tutor.
        const usedContact = wrapper
            .findAll('li')
            .find((item) => item.text().includes('Contacto usado'))!;
        expect(usedContact.text()).toContain(EXCEPTION.phoneNumber);
        expect(usedContact.text()).not.toContain(OWNER.phoneNumber);
    });

    it('assinala que o contacto específico não tem WhatsApp', () => {
        const wrapper = mountSummary({ ...BASE_HOSPITALIZATION, contact: EXCEPTION });

        expect(wrapper.text()).toContain('Não tem WhatsApp');
    });
});
