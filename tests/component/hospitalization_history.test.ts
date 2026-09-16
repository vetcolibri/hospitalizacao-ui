import { beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import HospitalizationHistory from '@/components/patients/HospitalizationHistory.vue';
import PatientSummary from '@/components/patients/PatientSummary.vue';
import { Provided } from '@/lib/provided';
import { left, right, type Either } from '@/lib/shared/either';
import type { ApiError } from '@/lib/apiClient/api_error';
import type { HospitalizationHistorySummaryModel } from '@/lib/models/hospitalization_history';
import type { PatientModel } from '@/lib/models/patient';

beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
});

const PATIENT_ID = 'sys-A';

const OPEN_EPISODE: HospitalizationHistorySummaryModel = {
    hospitalizationId: 'h2',
    entryDate: '2026-03-01T08:00:00.000Z',
    status: 'Aberta'
};

const CLOSED_EPISODE: HospitalizationHistorySummaryModel = {
    hospitalizationId: 'h1',
    entryDate: '2026-03-01T08:00:00.000Z',
    dischargeDate: '2026-03-05T08:00:00.000Z',
    status: 'Fechada'
};

const OLDER_EPISODE: HospitalizationHistorySummaryModel = {
    hospitalizationId: 'h0',
    entryDate: '2026-01-01T08:00:00.000Z',
    dischargeDate: '2026-01-04T08:00:00.000Z',
    status: 'Fechada'
};

const ZERO_LINK_STATUS = { reportsWithoutHospitalization: 0, roundsWithoutHospitalization: 0 };

function makeDetail(hospitalizationId: string, marker: string) {
    return {
        hospitalization: {
            hospitalizationId,
            patientId: PATIENT_ID,
            weight: 12.5,
            status: hospitalizationId === 'h2' ? 'Aberta' : 'Fechada',
            complaints: ['Anorexia'],
            diagnostics: ['Por Definir'],
            entryDate: '2026-03-01T08:00:00.000Z'
        },
        budget:
            hospitalizationId === 'h2'
                ? null
                : {
                      budgetId: 'budget-1',
                      hospitalizationId,
                      startOn: '2026-03-01T00:00:00.000Z',
                      endOn: '2026-03-05T00:00:00.000Z',
                      status: 'PAGO'
                  },
        rounds: [
            {
                roundId: 'round-1',
                issuedAt: '2026-03-02T09:00:00.000Z',
                measurements: [{ name: 'heartRate', value: marker, issuedAt: '2026-03-02T09:00:00.000Z' }]
            }
        ],
        reports: [
            {
                reportId: 'report-1',
                createdAt: '2026-03-02T09:30:00.000Z',
                stateOfConsciousness: ['Alerta'],
                food: { types: ['Ração'], level: '1', datetime: '2026-03-02T09:30:00.000Z' },
                discharges: [
                    { type: 'Urina', aspects: [marker] },
                    { type: 'Fezes', aspects: ['Normal', marker] }
                ],
                comments: marker
            }
        ],
        contact: { name: `Contacto ${marker}`, phoneNumber: '923456789', whatsapp: false },
        contactIsSpecific: hospitalizationId === 'h2'
    };
}

type ListResult = Either<ApiError, HospitalizationHistorySummaryModel[]>;
type DetailResult = Either<ApiError, ReturnType<typeof makeDetail>>;
type LinkResult = Either<ApiError, typeof ZERO_LINK_STATUS>;

/** Promessa controlada pelo teste (resolvida explicitamente). */
function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => (resolve = r));
    return { promise, resolve };
}

interface ServiceOptions {
    list?: (patientId: string) => Promise<ListResult>;
    detail?: (hospitalizationId: string) => Promise<DetailResult>;
    linkStatus?: (patientId: string) => Promise<Either<ApiError, typeof ZERO_LINK_STATUS>>;
}

function makeService(options: ServiceOptions = {}) {
    const service = {
        listByPatient: vi.fn((patientId: string) =>
            (options.list ?? (() => Promise.resolve(right([]))))(patientId)
        ),
        detail: vi.fn((_patientId: string, hospitalizationId: string) =>
            (options.detail ?? ((id: string) => Promise.resolve(right(makeDetail(id, 'x')))))(hospitalizationId)
        ),
        linkStatus: vi.fn((patientId: string) =>
            (options.linkStatus ?? (() => Promise.resolve(right(ZERO_LINK_STATUS))))(patientId)
        )
    };

    return service;
}

function mountHistory(service: ReturnType<typeof makeService>, props: Record<string, unknown> = {}) {
    return mount(HospitalizationHistory, {
        props: { patientId: PATIENT_ID, active: true, ...props },
        global: { provide: { [Provided.HospitalizationHistoryService]: service } }
    });
}

async function loadHistory(service: ReturnType<typeof makeService>): Promise<VueWrapper> {
    const wrapper = mountHistory(service);
    await flushPromises();
    return wrapper;
}

function episodeItems(wrapper: VueWrapper) {
    return wrapper.findAll('[data-hospitalization-id]');
}

describe('histórico de hospitalizações do paciente', () => {
    it('lista da mais recente para a mais antiga e desempata pelo id', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OLDER_EPISODE, CLOSED_EPISODE, OPEN_EPISODE]))
        });

        const wrapper = await loadHistory(service);
        const ids = episodeItems(wrapper).map((item) => item.attributes('data-hospitalization-id'));

        expect(ids).toEqual(['h2', 'h1', 'h0']);
    });

    it('distingue visualmente o episódio activo do encerrado', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([CLOSED_EPISODE, OPEN_EPISODE]))
        });

        const wrapper = await loadHistory(service);
        const items = episodeItems(wrapper);

        expect(items[0].text()).toContain('Activa');
        expect(items[1].text()).toContain('Encerrada');
    });

    it('mostra um estado vazio claro quando o paciente não tem histórico', async () => {
        const wrapper = await loadHistory(makeService({ list: () => Promise.resolve(right([])) }));

        expect(wrapper.text()).toContain('Sem histórico de hospitalizações');
        expect(episodeItems(wrapper)).toHaveLength(0);
    });

    it('abre um episódio e mostra só os seus dados, em modo de leitura', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => Promise.resolve(right(makeDetail(id, id === 'h1' ? 'MARCADOR-H1' : 'MARCADOR-H2')))
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();

        expect(service.detail).toHaveBeenCalledWith(PATIENT_ID, 'h1');
        expect(wrapper.text()).toContain('MARCADOR-H1');
        expect(wrapper.text()).not.toContain('MARCADOR-H2');
        expect(wrapper.text()).toContain('Orçamento');
        expect(wrapper.text()).toContain('Rondas / Exames');
        expect(wrapper.text()).toContain('Relatórios / Comunicações');
        expect(wrapper.text()).toContain('Contacto usado');
        // Modo de leitura nesta fase: sem botões de acção clínica.
        expect(wrapper.find('form').exists()).toBe(false);
    });

    it('no episódio encerrado não existem controlos de edição nem acções clínicas', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => Promise.resolve(right(makeDetail(id, 'MARCADOR-H1')))
        });

        const wrapper = await loadHistory(service);

        // Abre o episódio encerrado (h1).
        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain('Encerrada');
        expect(wrapper.find('form').exists()).toBe(false);
        expect(wrapper.find('input').exists()).toBe(false);
        expect(wrapper.find('select').exists()).toBe(false);
        expect(wrapper.find('textarea').exists()).toBe(false);

        for (const action of ['Encerrar', 'Editar', 'Alterar', 'Guardar', 'Apagar', 'Cancelar']) {
            expect(wrapper.text()).not.toContain(action);
        }

        // A única interacção é a selecção entre episódios; não há botões de acção.
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBeGreaterThan(0);
        expect(
            buttons.every((button) => button.attributes('data-hospitalization-id') !== undefined)
        ).toBe(true);
    });

    it('durante o carregamento limpa o detalhe anterior e mantém a selecção', async () => {
        let resolveSecond: (result: DetailResult) => void = () => {};
        const second = new Promise<DetailResult>((resolve) => (resolveSecond = resolve));
        let calls = 0;

        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => {
                calls++;
                if (calls === 1) return Promise.resolve(right(makeDetail(id, 'MARCADOR-H2')));
                return second;
            }
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H2');

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();

        // O detalhe anterior desaparece imediatamente ao iniciar nova selecção.
        expect(wrapper.text()).not.toContain('MARCADOR-H2');
        expect(episodeItems(wrapper)[1].attributes('aria-current')).toBe('true');

        resolveSecond(right(makeDetail('h1', 'MARCADOR-H1')));
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H1');
    });

    it('em erro limpa o detalhe anterior e assinala a falha', async () => {
        let calls = 0;

        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => {
                calls++;
                if (calls === 1) return Promise.resolve(right(makeDetail(id, 'MARCADOR-H2')));
                return Promise.resolve(left({ status: 404, message: 'Hospitalização não encontrada' }) as DetailResult);
            }
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H2');

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();

        // Nunca mostra o detalhe de H1 sob a selecção de H2.
        expect(wrapper.text()).not.toContain('MARCADOR-H2');
        expect(wrapper.text()).toContain('Não foi possível carregar este episódio');
        expect(episodeItems(wrapper)[1].attributes('aria-current')).toBe('true');
    });

    it('H1 carregado -> H2 (mesmo paciente): H1 desaparece e nunca aparece sob H2', async () => {
        const h2 = deferred<DetailResult>();
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) =>
                id === 'h1'
                    ? Promise.resolve(right(makeDetail('h1', 'MARCADOR-H1')))
                    : h2.promise
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H1');

        // H2 fica em voo: H1 tem de desaparecer logo.
        await episodeItems(wrapper)[0].trigger('click');
        await flushPromises();
        expect(wrapper.text()).not.toContain('MARCADOR-H1');

        h2.resolve(right(makeDetail('h2', 'MARCADOR-H2')));
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H2');
        expect(wrapper.text()).not.toContain('MARCADOR-H1');
    });

    it('H1 carregado -> H2 falha: H1 nunca aparece sob H2', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) =>
                id === 'h1'
                    ? Promise.resolve(right(makeDetail('h1', 'MARCADOR-H1')))
                    : Promise.resolve(
                        left({ status: 404, message: 'Hospitalização não encontrada' }) as DetailResult
                    )
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H1');

        await episodeItems(wrapper)[0].trigger('click');
        await flushPromises();

        expect(wrapper.text()).not.toContain('MARCADOR-H1');
        expect(wrapper.text()).toContain('Não foi possível carregar este episódio');
    });

    it('expõe cada episódio como um botão acessível por teclado', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE]))
        });

        const wrapper = await loadHistory(service);

        for (const item of episodeItems(wrapper)) {
            expect(item.element.tagName).toBe('BUTTON');
            expect(item.attributes('type')).toBe('button');
        }
    });

    it('renderiza as descargas do relatório do episódio seleccionado', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) =>
                Promise.resolve(right(makeDetail(id, id === 'h1' ? 'MARCADOR-H1' : 'MARCADOR-H2')))
        });

        const wrapper = await loadHistory(service);

        await episodeItems(wrapper)[1].trigger('click');
        await flushPromises();

        // Tipos e aspectos das descargas do episódio seleccionado.
        expect(wrapper.text()).toContain('Urina');
        expect(wrapper.text()).toContain('Fezes');
        expect(wrapper.text()).toContain('MARCADOR-H1');
        expect(wrapper.text()).not.toContain('MARCADOR-H2');
    });

    it('assinala o legado por classificar sem o atribuir a um episódio', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE])),
            linkStatus: () =>
                Promise.resolve(
                    right({ reportsWithoutHospitalization: 1154, roundsWithoutHospitalization: 503 })
                )
        });

        const wrapper = await loadHistory(service);

        expect(wrapper.text()).toContain('por classificar');
        // O aviso é do paciente actual, não um total global.
        expect(service.linkStatus).toHaveBeenCalledWith(PATIENT_ID);
    });

    it('não mostra aviso quando o paciente actual não tem pendências', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE])),
            linkStatus: () => Promise.resolve(right(ZERO_LINK_STATUS))
        });

        const wrapper = await loadHistory(service);

        expect(wrapper.text()).not.toContain('por classificar');
        expect(service.linkStatus).toHaveBeenCalledWith(PATIENT_ID);
    });

    it('recarrega o histórico e o aviso quando o paciente muda', async () => {
        const service = makeService({
            list: (patientId) =>
                Promise.resolve(right(patientId === PATIENT_ID ? [OPEN_EPISODE] : [CLOSED_EPISODE])),
            linkStatus: (patientId) =>
                Promise.resolve(
                    right(
                        patientId === PATIENT_ID
                            ? { reportsWithoutHospitalization: 5, roundsWithoutHospitalization: 5 }
                            : ZERO_LINK_STATUS
                    )
                )
        });

        const wrapper = await loadHistory(service);
        expect(episodeItems(wrapper).map((item) => item.attributes('data-hospitalization-id'))).toEqual([
            'h2'
        ]);
        expect(wrapper.text()).toContain('por classificar');

        await wrapper.setProps({ patientId: 'sys-B' });
        await flushPromises();

        expect(episodeItems(wrapper).map((item) => item.attributes('data-hospitalization-id'))).toEqual([
            'h1'
        ]);
        expect(wrapper.text()).not.toContain('por classificar');
        expect(service.linkStatus).toHaveBeenCalledWith('sys-B');
    });

    it('abre o episódio exacto indicado pelo deep-link', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => Promise.resolve(right(makeDetail(id, 'DEEP-LINK-H1')))
        });

        const wrapper = mountHistory(service, { initialHospitalizationId: 'h1' });
        await flushPromises();

        expect(service.detail).toHaveBeenCalledWith(PATIENT_ID, 'h1');
        expect(wrapper.text()).toContain('DEEP-LINK-H1');
    });

    it('o deep-link para episódio de outro paciente mostra o erro do backend', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE])),
            detail: () =>
                Promise.resolve(
                    left({ status: 404, message: 'Hospitalização não encontrada' }) as DetailResult
                )
        });

        const wrapper = mountHistory(service, { initialHospitalizationId: 'de-outro-paciente' });
        await flushPromises();

        expect(service.detail).toHaveBeenCalledWith(PATIENT_ID, 'de-outro-paciente');
        expect(wrapper.text()).toContain('Não foi possível carregar este episódio');
    });

    it('mudar o deep-link selecciona o novo episódio', async () => {
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => Promise.resolve(right(makeDetail(id, `DEEP-${id}`)))
        });

        const wrapper = mountHistory(service, { initialHospitalizationId: 'h1' });
        await flushPromises();
        expect(wrapper.text()).toContain('DEEP-h1');

        await wrapper.setProps({ initialHospitalizationId: 'h2' });
        await flushPromises();

        expect(service.detail).toHaveBeenCalledWith(PATIENT_ID, 'h2');
        expect(wrapper.text()).toContain('DEEP-h2');
    });

    it('H1 em voo -> H2 do mesmo paciente nunca volta a H1', async () => {
        const list = deferred<ListResult>();
        const h2 = deferred<DetailResult>();
        const service = makeService({
            list: () => list.promise,
            detail: () => h2.promise
        });

        const wrapper = mountHistory(service, { initialHospitalizationId: 'h1' });
        await flushPromises();

        await wrapper.setProps({ initialHospitalizationId: 'h2' });
        await flushPromises();

        // A lista antiga resolve agora: a execução antiga retoma aqui.
        list.resolve(right([OPEN_EPISODE, CLOSED_EPISODE]));
        await flushPromises();

        expect(service.detail).not.toHaveBeenCalledWith(PATIENT_ID, 'h1');
        expect(service.detail).toHaveBeenCalledWith(PATIENT_ID, 'h2');

        h2.resolve(right(makeDetail('h2', 'MARCADOR-H2')));
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H2');
    });

    it('paciente A em voo não entrega summaries nem linkStatus a B', async () => {
        const listA = deferred<ListResult>();
        const listB = deferred<ListResult>();
        const statusA = deferred<LinkResult>();
        const statusB = deferred<LinkResult>();

        const service = makeService({
            list: (patientId) => (patientId === PATIENT_ID ? listA.promise : listB.promise),
            linkStatus: (patientId) => (patientId === PATIENT_ID ? statusA.promise : statusB.promise)
        });

        const wrapper = mountHistory(service, { patientId: PATIENT_ID });
        await flushPromises();

        await wrapper.setProps({ patientId: 'sys-B' });
        await flushPromises();

        // A responde tarde: não pode aparecer em B.
        listA.resolve(right([OPEN_EPISODE]));
        statusA.resolve(
            right({ reportsWithoutHospitalization: 99, roundsWithoutHospitalization: 99 })
        );
        await flushPromises();

        expect(episodeItems(wrapper)).toHaveLength(0);
        expect(wrapper.text()).not.toContain('por classificar');

        listB.resolve(right([CLOSED_EPISODE]));
        statusB.resolve(right(ZERO_LINK_STATUS));
        await flushPromises();

        expect(episodeItems(wrapper).map((item) => item.attributes('data-hospitalization-id'))).toEqual([
            'h1'
        ]);
        expect(wrapper.text()).not.toContain('por classificar');
    });

    it('o detalhe final coincide sempre com a query mais recente', async () => {
        const h1 = deferred<DetailResult>();
        const h2 = deferred<DetailResult>();
        const service = makeService({
            list: () => Promise.resolve(right([OPEN_EPISODE, CLOSED_EPISODE])),
            detail: (id) => (id === 'h1' ? h1.promise : h2.promise)
        });

        const wrapper = mountHistory(service, { initialHospitalizationId: 'h1' });
        await flushPromises();

        await wrapper.setProps({ initialHospitalizationId: 'h2' });
        await flushPromises();

        // A resposta antiga chega tarde e tem de ser descartada.
        h1.resolve(right(makeDetail('h1', 'MARCADOR-H1')));
        await flushPromises();
        expect(wrapper.text()).not.toContain('MARCADOR-H1');

        h2.resolve(right(makeDetail('h2', 'MARCADOR-H2')));
        await flushPromises();
        expect(wrapper.text()).toContain('MARCADOR-H2');
    });
});

describe('ficha do paciente', () => {
    const PATIENT: PatientModel = {
        systemId: PATIENT_ID,
        patientId: '10340A',
        name: 'Loki',
        specie: 'CANINO',
        breed: 'Akita',
        status: 'HOSPITALIZADO',
        birthDate: '2012-11-11',
        age: '13 anos',
        ownerId: 'OWN1'
    };

    it('inclui o separador Histórico na ficha do paciente', async () => {
        const service = makeService({ list: () => Promise.resolve(right([])) });

        const wrapper = mount(PatientSummary, {
            props: { patient: PATIENT, owner: undefined, hospitalization: undefined, budget: undefined },
            global: {
                provide: {
                    [Provided.PatientService]: { endBudget: () => Promise.resolve() },
                    [Provided.HospitalizationHistoryService]: service
                }
            }
        });

        const tab = wrapper.findAll('li.tab').find((item) => item.text().includes('Histórico'));
        expect(tab).toBeDefined();

        await tab!.trigger('click');
        await flushPromises();

        expect(service.listByPatient).toHaveBeenCalledWith(PATIENT_ID);
    });

    it('abre o separador Histórico com o teclado', async () => {
        const service = makeService({ list: () => Promise.resolve(right([])) });

        const wrapper = mount(PatientSummary, {
            props: { patient: PATIENT, owner: undefined, hospitalization: undefined, budget: undefined },
            global: {
                provide: {
                    [Provided.PatientService]: { endBudget: () => Promise.resolve() },
                    [Provided.HospitalizationHistoryService]: service
                }
            }
        });

        const tab = wrapper.findAll('li.tab').find((item) => item.text().includes('Histórico'))!;
        expect(tab.attributes('tabindex')).toBe('0');

        await tab.trigger('keydown.enter');
        await flushPromises();

        expect(service.listByPatient).toHaveBeenCalledWith(PATIENT_ID);
    });
});
