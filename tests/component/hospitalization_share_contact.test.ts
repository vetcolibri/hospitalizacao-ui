import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import PatientCondition from '@/components/patients/PatientCondition.vue';
import { Provided } from '@/lib/provided';
import { left, right, type Either } from '@/lib/shared/either';
import type { ApiError } from '@/lib/apiClient/api_error';
import type { OwnerModel } from '@/lib/models/owner';
import type { ContactModel } from '@/lib/models/contact';

vi.mock('@/lib/shared/share', () => ({
    shareOrCopy: vi.fn(),
    share: vi.fn(),
    copy: vi.fn()
}));

import { shareOrCopy } from '@/lib/shared/share';

beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
    // O ambiente de testes não expõe sempre localStorage; o componente só lê o username.
    if (!globalThis.localStorage) {
        Object.defineProperty(globalThis, 'localStorage', {
            value: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
            configurable: true
        });
    }
});

const OWNER: OwnerModel = {
    ownerId: 'OWN1',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
    whatsapp: true
};

const EXCEPTION: ContactModel = {
    name: 'Maria José',
    phoneNumber: '923456789',
    whatsapp: false
};

function makeCrmService(ownerResult: Either<ApiError, OwnerModel> = right(OWNER)) {
    return {
        registerReport: vi.fn().mockResolvedValue(right(undefined)),
        findOwner: vi.fn().mockResolvedValue(ownerResult),
        getOwners: vi.fn().mockResolvedValue([]),
        getReports: vi.fn().mockResolvedValue(right([]))
    };
}

async function fillReport(wrapper: VueWrapper) {
    const selects = wrapper.findAllComponents({ name: 'BaseSelect' });
    selects[0].vm.$emit('update:modelValue', ['Alerta']);
    selects[1].vm.$emit('update:modelValue', ['Ração seca']);

    await wrapper.find('input[type="datetime-local"]').setValue('2026-01-01T10:00');
    await wrapper.findAll('select')[0].setValue('1');
    await wrapper.find('textarea').setValue('Paciente estável');
    await flushPromises();
}

async function communicate(wrapper: VueWrapper) {
    const button = wrapper.findAll('button').find((b) => b.text().includes('Comunicar'))!;
    await button.trigger('click');
    await flushPromises();
}

function mountCondition(service: ReturnType<typeof makeCrmService>, contact?: ContactModel) {
    return mount(PatientCondition, {
        props: { patientId: 'sys-A', ownerId: OWNER.ownerId, contact },
        global: {
            provide: { [Provided.CrmService]: service }
        }
    });
}

describe('partilha com o contacto efectivo da hospitalização', () => {
    beforeEach(() => {
        vi.mocked(shareOrCopy).mockClear();
    });

    it('sem excepção partilha com o tutor principal', async () => {
        const service = makeCrmService();
        const wrapper = mountCondition(service);

        await fillReport(wrapper);
        await communicate(wrapper);

        expect(service.findOwner).toHaveBeenCalledWith(OWNER.ownerId);
        expect(shareOrCopy).toHaveBeenCalledWith({
            patientId: 'sys-A',
            phoneNumber: OWNER.phoneNumber,
            hasWhatsApp: OWNER.whatsapp
        });
    });

    it('com excepção partilha com o contacto da hospitalização e não com o tutor', async () => {
        const service = makeCrmService();
        const wrapper = mountCondition(service, EXCEPTION);

        await fillReport(wrapper);
        await communicate(wrapper);

        expect(shareOrCopy).toHaveBeenCalledWith({
            patientId: 'sys-A',
            phoneNumber: EXCEPTION.phoneNumber,
            hasWhatsApp: EXCEPTION.whatsapp
        });
    });

    it('com excepção não consulta o tutor nem deixa a sua falha impedir a partilha', async () => {
        const service = makeCrmService(left({ status: 404, message: 'Tutor não encontrado.' }));
        const wrapper = mountCondition(service, EXCEPTION);

        await fillReport(wrapper);
        await communicate(wrapper);

        expect(service.findOwner).not.toHaveBeenCalled();
        expect(shareOrCopy).toHaveBeenCalledWith({
            patientId: 'sys-A',
            phoneNumber: EXCEPTION.phoneNumber,
            hasWhatsApp: EXCEPTION.whatsapp
        });
    });
});
