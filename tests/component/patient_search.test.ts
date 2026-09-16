import { describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import PatientSearch from '@/components/forms/PatientSearch.vue';
import { Provided } from '@/lib/provided';
import { left, right } from '@/lib/shared/either';
import type { PatientSearchResultModel } from '@/lib/models/patient';

const SEARCHABLE: PatientSearchResultModel = {
    systemId: 'sys-1',
    patientId: '10340A',
    patientName: 'Loki',
    ownerId: 'OWN1',
    ownerName: 'Ana Tutor',
    specie: 'CANINO',
    breed: 'Akita',
    birthDate: '2012-11-11',
    status: 'ALTA MEDICA'
};

const HOSPITALIZED: PatientSearchResultModel = {
    ...SEARCHABLE,
    systemId: 'sys-2',
    patientId: '10340B',
    patientName: 'Mel',
    status: 'HOSPITALIZADO'
};

class ControlledSearchService {
    readonly calls: { term: string; resolve: (value: unknown) => void }[] = [];

    searchPatients(term: string): Promise<unknown> {
        return new Promise((resolve) => this.calls.push({ term, resolve }));
    }
}

function mountSearch(service: ControlledSearchService): VueWrapper {
    return mount(PatientSearch, {
        global: { provide: { [Provided.PatientService]: service } }
    });
}

const waitDebounce = () => new Promise((resolve) => setTimeout(resolve, 330));

async function search(
    wrapper: VueWrapper,
    service: ControlledSearchService,
    term: string,
    results: PatientSearchResultModel[]
) {
    await wrapper.find('input').setValue(term);
    await waitDebounce();
    service.calls[service.calls.length - 1].resolve(right(results));
    await flushPromises();
}

describe('pesquisa unificada de pacientes', () => {
    it('não pesquisa com menos de 2 caracteres', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('a');
        await waitDebounce();

        expect(service.calls).toHaveLength(0);
    });

    it('pesquisa com debounce depois de 2 caracteres', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('lo');
        expect(service.calls).toHaveLength(0);

        await waitDebounce();
        expect(service.calls.map((call) => call.term)).toEqual(['lo']);
    });

    it('mostra loading e depois os resultados com os quatro identificadores', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('loki');
        expect(wrapper.text()).toContain('A pesquisar…');

        await waitDebounce();
        service.calls[0].resolve(right([SEARCHABLE]));
        await flushPromises();

        const text = wrapper.text();
        expect(text).toContain('ID Paciente:');
        expect(text).toContain('10340A');
        expect(text).toContain('ID Tutor:');
        expect(text).toContain('OWN1');
        expect(text).toContain('Nome Paciente:');
        expect(text).toContain('Loki');
        expect(text).toContain('Nome Tutor:');
        expect(text).toContain('Ana Tutor');
    });

    it('mostra estado vazio quando não há resultados', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await search(wrapper, service, 'loki', []);

        expect(wrapper.text()).toContain('Sem resultados');
    });

    it('mostra erro quando a pesquisa falha', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('loki');
        await waitDebounce();
        service.calls[0].resolve(left({ status: 500, message: 'erro' }));
        await flushPromises();

        expect(wrapper.text()).toContain('Não foi possível pesquisar');
    });

    it('ignora respostas obsoletas', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('loki');
        await waitDebounce();
        await wrapper.find('input').setValue('lokita');
        await waitDebounce();

        // A primeira resposta chega tarde e tem de ser descartada.
        service.calls[0].resolve(right([SEARCHABLE]));
        await flushPromises();
        expect(wrapper.text()).not.toContain('Loki');

        service.calls[1].resolve(right([HOSPITALIZED]));
        await flushPromises();
        expect(wrapper.text()).toContain('Mel');
    });

    it('mostra até 10 resultados', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        const many = Array.from({ length: 10 }, (_, i) => ({
            ...SEARCHABLE,
            systemId: `sys-${i}`,
            patientId: `P-${i}`
        }));

        await search(wrapper, service, 'token', many);

        expect(wrapper.findAll('[data-search-system-id]')).toHaveLength(10);
    });

    it('mostra já internado mas não permite seleccionar', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await search(wrapper, service, 'mel', [HOSPITALIZED]);

        const button = wrapper.find('[data-search-system-id="sys-2"]');
        expect(button.attributes('disabled')).toBeDefined();
        expect(wrapper.text()).toContain('Já internado');

        await button.trigger('click');
        expect(wrapper.emitted('select')).toBeUndefined();
    });

    it('selecciona um paciente com alta', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await search(wrapper, service, 'loki', [SEARCHABLE]);

        await wrapper.find('[data-search-system-id="sys-1"]').trigger('click');

        const emitted = wrapper.emitted('select');
        expect(emitted).toBeDefined();
        expect((emitted![0][0] as PatientSearchResultModel).systemId).toBe('sys-1');
    });

    it('editar o termo invalida a selecção anterior', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await search(wrapper, service, 'loki', [SEARCHABLE]);
        await wrapper.find('[data-search-system-id="sys-1"]').trigger('click');

        await wrapper.find('input').setValue('loki x');

        expect(wrapper.emitted('clear')).toBeDefined();
    });

    it('"Criar novo paciente" limpa a pesquisa e pede o modo novo', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await search(wrapper, service, 'loki', [SEARCHABLE]);
        await wrapper.find('[data-search-system-id="sys-1"]').trigger('click');

        const button = wrapper.findAll('button').find((item) =>
            item.text().includes('Criar novo paciente')
        )!;
        await button.trigger('click');

        expect(wrapper.emitted('new')).toBeDefined();
        expect(wrapper.emitted('clear')).toBeDefined();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
        expect(wrapper.findAll('[data-search-system-id]')).toHaveLength(0);
    });

    it('ao desmontar cancela o debounce e não chega a pesquisar', async () => {
        const service = new ControlledSearchService();
        const wrapper = mountSearch(service);

        await wrapper.find('input').setValue('loki');
        wrapper.unmount();

        await waitDebounce();

        expect(service.calls).toHaveLength(0);
    });

    it('ao desmontar ignora uma resposta em voo e não volta a chamar o pai', async () => {
        const service = new ControlledSearchService();

        // Pai que fica montado e observa os eventos do filho.
        const Parent = defineComponent({
            setup() {
                const events: boolean[] = [];
                const show = ref(true);
                return { events, show };
            },
            render() {
                return h('div', this.show
                    ? [
                        h(PatientSearch, {
                            onSearching: (value: boolean) => this.events.push(value),
                            onClear: () => this.events.push(false)
                        })
                    ]
                    : []);
            }
        });

        const wrapper = mount(Parent, {
            global: { provide: { [Provided.PatientService]: service } }
        });

        await wrapper.find('input').setValue('loki');
        await waitDebounce();
        expect(service.calls).toHaveLength(1);

        const before = (wrapper.vm as unknown as { events: boolean[] }).events.length;

        // Desmonta só o filho; o pai continua montado a observar.
        (wrapper.vm as unknown as { show: boolean }).show = false;
        await nextTick();

        service.calls[0].resolve(right([SEARCHABLE]));
        await flushPromises();

        expect((wrapper.vm as unknown as { events: boolean[] }).events.length).toBe(before);
    });
});
