import { expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PatientForm from '@/components/forms/PatientForm.vue';
import { Provided } from '@/lib/provided';
import { right } from '@/lib/shared/either';

const SEARCHED_PATIENT = {
    systemId: 'sys-A',
    patientId: '10340A',
    name: 'Loki',
    specie: 'CANINO',
    breed: 'Akita',
    status: 'ALTA MEDICA',
    // A API devolve a data de nascimento completa; o input type=date só aceita YYYY-MM-DD.
    birthDate: '2012-11-11T00:00:00.000Z',
    age: ' 13 anos',
    ownerId: '10340A'
};

it('preenche a data de nascimento no formato aceite pelo input de data', async () => {
    const service = {
        searchPatient: () => Promise.resolve(right(SEARCHED_PATIENT))
    };
    const wrapper = mount(PatientForm, {
        global: { provide: { [Provided.PatientService]: service } }
    });

    await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');
    await flushPromises();

    const birthDate = wrapper.find('input[type="date"]').element as HTMLInputElement;

    expect(birthDate.value).toBe('2012-11-11');
    expect(birthDate.validity.valid).toBe(true);
    expect(birthDate.disabled).toBe(true);
});

it('deixa a data de nascimento vazia quando o paciente não tem data', async () => {
    const service = {
        searchPatient: () =>
            Promise.resolve(right({ ...SEARCHED_PATIENT, birthDate: '' }))
    };
    const wrapper = mount(PatientForm, {
        global: { provide: { [Provided.PatientService]: service } }
    });

    await wrapper.find('input[placeholder="ID do Paciente"]').setValue('10340A');
    await flushPromises();

    const birthDate = wrapper.find('input[type="date"]').element as HTMLInputElement;

    expect(birthDate.value).toBe('');
});
