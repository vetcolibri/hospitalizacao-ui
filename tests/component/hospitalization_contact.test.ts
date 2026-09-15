import { describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import HospitalizationForm from '@/components/forms/HospitalizationForm.vue';

/**
 * RF-13 — no formulário de hospitalização, o contacto específico é uma excepção
 * opcional: só aparece quando activada e nunca fica no payload quando desligada.
 */

function mountForm(): VueWrapper {
    return mount(HospitalizationForm);
}

function toggle(wrapper: VueWrapper) {
    return wrapper.find('[data-field="hospitalizationData.useContact"]');
}

function contactInput(wrapper: VueWrapper, field: string): HTMLInputElement {
    return wrapper.find(`[data-field="hospitalizationData.contact.${field}"] input`)
        .element as HTMLInputElement;
}

function whatsappCheckbox(wrapper: VueWrapper) {
    return wrapper.find('[data-field="hospitalizationData.contact.whatsapp"]');
}

function lastHospitalization(wrapper: VueWrapper) {
    const events = wrapper.emitted('hospitalization') ?? [];
    return events.at(-1)?.[0] as { contact?: unknown } | undefined;
}

describe('contacto específico na hospitalização', () => {
    it('começa desligado e sem campos de contacto', () => {
        const wrapper = mountForm();

        expect((toggle(wrapper).element as HTMLInputElement).checked).toBe(false);
        expect(wrapper.find('[data-field="hospitalizationData.contact.name"]').exists()).toBe(
            false
        );
        expect(
            wrapper.find('[data-field="hospitalizationData.contact.phoneNumber"]').exists()
        ).toBe(false);
        expect(lastHospitalization(wrapper)?.contact).toBeUndefined();
    });

    it('ao activar mostra os campos e envia o contacto explícito', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);

        expect(wrapper.find('[data-field="hospitalizationData.contact.name"]').exists()).toBe(true);
        expect(
            wrapper.find('[data-field="hospitalizationData.contact.phoneNumber"]').exists()
        ).toBe(true);

        await wrapper
            .find('[data-field="hospitalizationData.contact.name"] input')
            .setValue('Maria José');
        await wrapper
            .find('[data-field="hospitalizationData.contact.phoneNumber"] input')
            .setValue('923456789');
        await whatsappCheckbox(wrapper).setValue(true);

        expect(lastHospitalization(wrapper)?.contact).toEqual({
            name: 'Maria José',
            phoneNumber: '923456789',
            whatsapp: true
        });
    });

    it('envia WhatsApp explicitamente falso quando o contacto não tem WhatsApp', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);
        await wrapper
            .find('[data-field="hospitalizationData.contact.name"] input')
            .setValue('Maria José');
        await wrapper
            .find('[data-field="hospitalizationData.contact.phoneNumber"] input')
            .setValue('923456789');

        expect(lastHospitalization(wrapper)?.contact).toEqual({
            name: 'Maria José',
            phoneNumber: '923456789',
            whatsapp: false
        });
    });

    it('ao desactivar limpa a excepção do payload', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);
        await wrapper
            .find('[data-field="hospitalizationData.contact.name"] input')
            .setValue('Maria José');
        await wrapper
            .find('[data-field="hospitalizationData.contact.phoneNumber"] input')
            .setValue('923456789');

        await toggle(wrapper).setValue(false);

        expect(lastHospitalization(wrapper)?.contact).toBeUndefined();
        expect(wrapper.find('[data-field="hospitalizationData.contact.name"]').exists()).toBe(
            false
        );
    });

    it('exige o nome do contacto', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);
        const name = contactInput(wrapper, 'name');
        await wrapper.find('[data-field="hospitalizationData.contact.name"] input').setValue('');

        expect(name.required).toBe(true);
        expect(name.validity.valueMissing).toBe(true);
    });

    it('valida o telefone angolano do contacto', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);
        const phone = contactInput(wrapper, 'phoneNumber');
        await wrapper
            .find('[data-field="hospitalizationData.contact.phoneNumber"] input')
            .setValue('12345');

        expect(phone.required).toBe(true);
        expect(phone.validity.patternMismatch).toBe(true);

        await wrapper
            .find('[data-field="hospitalizationData.contact.phoneNumber"] input')
            .setValue('923456789');
        expect(phone.validity.patternMismatch).toBe(false);
    });

    it('ao limpar depois de guardar remove a excepção', async () => {
        const wrapper = mountForm();

        await toggle(wrapper).setValue(true);
        await wrapper
            .find('[data-field="hospitalizationData.contact.name"] input')
            .setValue('Maria José');

        (wrapper.vm as unknown as { clear: () => void }).clear();
        await nextTick();

        expect(lastHospitalization(wrapper)?.contact).toBeUndefined();
        expect((toggle(wrapper).element as HTMLInputElement).checked).toBe(false);
        expect(wrapper.find('[data-field="hospitalizationData.contact.name"]').exists()).toBe(
            false
        );
    });
});
