import { beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import RecentHospitalizations from '@/views/RecentHospitalizations.vue';
import { Provided } from '@/lib/provided';
import { left, right } from '@/lib/shared/either';
import type { RecentHospitalizationModel } from '@/lib/models/recent_hospitalization';

const ROW: RecentHospitalizationModel = {
    hospitalizationId: 'h-1',
    systemId: 'sys-1',
    entryDate: '2026-03-05T08:00:00.000Z',
    dischargeDate: '2026-03-10T08:00:00.000Z',
    status: 'Fechada',
    patientId: '10340A',
    patientName: 'Loki',
    ownerId: 'OWN1',
    ownerName: 'Ana Tutor'
};

const OPEN_ROW: RecentHospitalizationModel = {
    ...ROW,
    hospitalizationId: 'h-2',
    systemId: 'sys-2',
    dischargeDate: undefined,
    status: 'Aberta',
    patientId: '10340B',
    patientName: 'Mel'
};

class FakeService {
    readonly calls: { term?: string; from?: string; to?: string; resolve: (value: unknown) => void }[] =
        [];

    recent(filters: { term?: string; from?: string; to?: string }): Promise<unknown> {
        return new Promise((resolve) => this.calls.push({ ...filters, resolve }));
    }
}

function makeRouter(): Router {
    return createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: '/hospitalizations/',
                name: 'RecentHospitalizations',
                component: { render: () => null }
            }
        ]
    });
}

async function mountPage(
    service: FakeService,
    router: Router
): Promise<VueWrapper> {
    const wrapper = mount(RecentHospitalizations, {
        global: {
            plugins: [router],
            provide: { [Provided.HospitalizationService]: service },
            stubs: {
                Header: true,
                GoBack: true,
                Footer: true,
                HospitalizationHistory: defineComponent({
                    name: 'HospitalizationHistory',
                    props: ['patientId', 'initialHospitalizationId', 'active'],
                    setup(props) {
                        return () =>
                            h('div', {
                                'data-detail': '',
                                'data-detail-patient': props.patientId,
                                'data-detail-hospitalization': props.initialHospitalizationId
                            });
                    }
                })
            }
        }
    });
    await flushPromises();
    // Deixa o carregamento inicial (recentes sem filtros) correr.
    await new Promise((resolve) => setTimeout(resolve, 20));
    await flushPromises();
    return wrapper;
}

function lastCall(service: FakeService) {
    return service.calls[service.calls.length - 1];
}

async function setTerm(wrapper: VueWrapper, term: string) {
    await wrapper.find('input[placeholder="Pesquisar internamentos (ID ou nome)"]').setValue(term);
    await new Promise((resolve) => setTimeout(resolve, 330));
}

function rows(wrapper: VueWrapper) {
    return wrapper.findAll('[data-recent-hospitalization-id]');
}

describe('página dos últimos internamentos', () => {
    let router: Router;

    beforeEach(async () => {
        router = makeRouter();
        await router.push('/hospitalizations/');
        await router.isReady();
    });

    it('lista com datas, estado e os quatro identificadores', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(right([ROW, OPEN_ROW]));
        await flushPromises();

        expect(rows(wrapper)).toHaveLength(2);
        const text = rows(wrapper)[0].text();
        expect(text).toContain('ID Paciente:');
        expect(text).toContain('10340A');
        expect(text).toContain('ID Tutor:');
        expect(text).toContain('OWN1');
        expect(text).toContain('Nome Paciente:');
        expect(text).toContain('Loki');
        expect(text).toContain('Nome Tutor:');
        expect(text).toContain('Ana Tutor');
        expect(text).toContain('Encerrada');
        expect(rows(wrapper)[0].element.tagName).toBe('BUTTON');
    });

    it('pesquisa só depois do debounce', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);
        const before = service.calls.length;

        await wrapper.find('input[placeholder="Pesquisar internamentos (ID ou nome)"]').setValue('lo');
        expect(service.calls).toHaveLength(before);

        await new Promise((resolve) => setTimeout(resolve, 330));
        expect(lastCall(service).term).toBe('lo');
    });

    it('descarta respostas obsoletas', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        const lokiCall = lastCall(service);
        await setTerm(wrapper, 'mel');
        const melCall = lastCall(service);

        lokiCall.resolve(right([ROW]));
        await flushPromises();
        expect(wrapper.text()).not.toContain('Loki');

        melCall.resolve(right([OPEN_ROW]));
        await flushPromises();
        expect(wrapper.text()).toContain('Mel');
    });

    it('envia o intervalo De/Até e limpa filtros', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await wrapper.find('input[data-field="recent.from"]').setValue('2026-01-01');
        await wrapper.find('input[data-field="recent.to"]').setValue('2026-01-31');
        await new Promise((resolve) => setTimeout(resolve, 330));

        const last = service.calls[service.calls.length - 1];
        expect(last.from).toBe('2026-01-01');
        expect(last.to).toBe('2026-01-31');

        const clear = wrapper.findAll('button').find((button) => button.text().includes('Limpar filtros'))!;
        await clear.trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 330));

        const cleared = service.calls[service.calls.length - 1];
        expect(cleared.from).toBeUndefined();
        expect(cleared.to).toBeUndefined();
        expect((wrapper.find('input[data-field="recent.from"]').element as HTMLInputElement).value).toBe('');
    });

    it('mostra vazio e erro', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(right([]));
        await flushPromises();
        expect(wrapper.text()).toContain('Sem internamentos');

        await setTerm(wrapper, 'mel');
        lastCall(service).resolve(left({ status: 500, message: '' }));
        await flushPromises();
        expect(wrapper.text()).toContain('Não foi possível carregar');
    });

    it('mostra a mensagem de filtro do servidor em vez do genérico', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(
            left({
                status: 400,
                message: 'A data inicial não pode ser posterior à data final.'
            })
        );
        await flushPromises();

        expect(wrapper.text()).toContain('A data inicial não pode ser posterior');
        expect(wrapper.text()).not.toContain('Não foi possível carregar');
    });

    it('500 com texto sensível usa a mensagem genérica sem expor internals', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(
            left({
                status: 500,
                message: 'SQLSTATE 23505 duplicate key value violates unique constraint'
            })
        );
        await flushPromises();

        expect(wrapper.text()).toContain('Não foi possível carregar os internamentos.');
        expect(wrapper.text()).not.toContain('SQLSTATE');
        expect(wrapper.text()).not.toContain('duplicate key');
    });

    it('403 usa mensagem de autorização segura, não o texto do servidor', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(
            left({ status: 403, message: 'O nível de Utilizador não lhe permite pesquisar pacientes.' })
        );
        await flushPromises();

        expect(wrapper.text()).toContain('Não tem permissão para consultar os internamentos.');
        expect(wrapper.text()).not.toContain('O nível de Utilizador');
    });

    it('401 usa mensagem de sessão segura', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(left({ status: 401, message: 'token inválido' }));
        await flushPromises();

        expect(wrapper.text()).toContain('Sessão expirada');
        expect(wrapper.text()).not.toContain('token inválido');
    });

    it('mudar um filtro limpa imediatamente as linhas antigas', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(right([ROW]));
        await flushPromises();
        expect(rows(wrapper)).toHaveLength(1);

        // Antes de o debounce disparar, as linhas antigas já não estão clicáveis.
        await wrapper.find('input[placeholder="Pesquisar internamentos (ID ou nome)"]').setValue('loki x');
        await flushPromises();
        expect(rows(wrapper)).toHaveLength(0);
    });

    it('1 carácter não chama a API e mostra orientação', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);
        const before = service.calls.length;

        await wrapper.find('input[placeholder="Pesquisar internamentos (ID ou nome)"]').setValue('l');
        await new Promise((resolve) => setTimeout(resolve, 330));

        expect(service.calls).toHaveLength(before);
        expect(wrapper.text()).toContain('pelo menos 2 caracteres');
    });

    it('limita o termo a 50 caracteres no input', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        expect(
            wrapper
                .find('input[placeholder="Pesquisar internamentos (ID ou nome)"]')
                .attributes('maxlength')
        ).toBe('50');
    });

    it('clicar numa linha abre o episódio exacto no deep-link', async () => {
        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(right([ROW]));
        await flushPromises();

        await rows(wrapper)[0].trigger('click');
        await flushPromises();

        expect(router.currentRoute.value.query.patientId).toBe('sys-1');
        expect(router.currentRoute.value.query.hospitalizationId).toBe('h-1');
    });

    it('o deep-link carrega o mesmo episódio read-only', async () => {
        await router.push('/hospitalizations/?patientId=sys-1&hospitalizationId=h-1');
        await router.isReady();

        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        const detail = wrapper.find('[data-detail]');
        expect(detail.attributes('data-detail-patient')).toBe('sys-1');
        expect(detail.attributes('data-detail-hospitalization')).toBe('h-1');
    });

    it('alterar um filtro invalida a selecção anterior', async () => {
        await router.push('/hospitalizations/?patientId=sys-1&hospitalizationId=h-1');
        await router.isReady();

        const service = new FakeService();
        const wrapper = await mountPage(service, router);

        await setTerm(wrapper, 'loki');
        lastCall(service).resolve(right([ROW]));
        await flushPromises();

        expect(router.currentRoute.value.query.hospitalizationId).toBeUndefined();
        expect(wrapper.find('[data-detail]').exists()).toBe(false);
    });
});
