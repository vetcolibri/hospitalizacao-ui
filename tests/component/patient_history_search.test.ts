import { beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PatientHistory from '@/views/PatientHistory.vue';
import { Provided } from '@/lib/provided';
import { left, right } from '@/lib/shared/either';
import type { PatientModel } from '@/lib/models/patient';
import type { ApiError } from '@/lib/apiClient/api_error';
import type { Either } from '@/lib/shared/either';

beforeAll(() => {
    HTMLDialogElement.prototype.showModal ??= function () {
        this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function () {
        this.removeAttribute('open');
    };
});

/**
 * RF-15 — o histórico de um paciente encerrado tem de ser alcançável depois da
 * alta: ausente da lista de hospitalizados, é pesquisado pelo ID da clínica e o
 * histórico abre em leitura, SEM criar uma nova hospitalização.
 */

const CLOSED_PATIENT: PatientModel = {
    systemId: 'sys-closed',
    patientId: 'CVL-777',
    name: 'Bobi',
    specie: 'CANINO',
    breed: 'SRD',
    status: 'ALTA MEDICA',
    birthDate: '2020-01-01',
    age: '6 anos',
    ownerId: 'OWN9'
};

const CLOSED_EPISODE = {
    hospitalizationId: 'h-closed',
    entryDate: '2026-01-01T08:00:00.000Z',
    dischargeDate: '2026-01-05T08:00:00.000Z',
    status: 'Fechada'
};

const ZERO_LINK_STATUS = { reportsWithoutHospitalization: 0, roundsWithoutHospitalization: 0 };

function makePatientService(
    result: Either<ApiError, PatientModel> = right(CLOSED_PATIENT)
) {
    return {
        searchPatient: vi.fn(() => Promise.resolve(result)),
        newHospitalization: vi.fn(),
        newPatient: vi.fn()
    };
}

function makeHistoryService() {
    return {
        listByPatient: vi.fn(() => Promise.resolve(right([CLOSED_EPISODE]))),
        detail: vi.fn((_patientId: string, hospitalizationId: string) =>
            Promise.resolve(
                right({
                    hospitalization: {
                        hospitalizationId,
                        patientId: CLOSED_PATIENT.systemId,
                        weight: 10,
                        status: 'Fechada',
                        complaints: ['Anorexia'],
                        diagnostics: ['Por Definir'],
                        entryDate: CLOSED_EPISODE.entryDate,
                        dischargeDate: CLOSED_EPISODE.dischargeDate
                    },
                    budget: null,
                    rounds: [],
                    reports: [],
                    contact: null,
                    contactIsSpecific: false
                })
            )
        ),
        linkStatus: vi.fn(() => Promise.resolve(right(ZERO_LINK_STATUS)))
    };
}

function mountView(patientService: ReturnType<typeof makePatientService>) {
    const historyService = makeHistoryService();

    const wrapper = mount(PatientHistory, {
        global: {
            provide: {
                [Provided.PatientService]: patientService,
                [Provided.HospitalizationHistoryService]: historyService
            },
            stubs: { Header: true, GoBack: true }
        }
    });

    return { wrapper, historyService };
}

async function search(wrapper: ReturnType<typeof mountView>['wrapper'], patientId: string) {
    await wrapper.find('input').setValue(patientId);
    const button = wrapper.findAll('button').find((b) => b.text().includes('Pesquisar'))!;
    await button.trigger('click');
    await flushPromises();
}

describe('pesquisa e histórico de paciente (qualquer estado)', () => {
    it('pesquisa um paciente encerrado ausente da lista activa e abre o histórico', async () => {
        const patientService = makePatientService();
        const { wrapper, historyService } = mountView(patientService);

        await search(wrapper, 'CVL-777');

        expect(patientService.searchPatient).toHaveBeenCalledWith('CVL-777');
        expect(wrapper.text()).toContain('Bobi');
        expect(wrapper.text()).toContain('ALTA MEDICA');
        expect(wrapper.text()).toContain('Histórico de hospitalizações');
        expect(wrapper.text()).toContain('Encerrada');
        expect(historyService.listByPatient).toHaveBeenCalledWith('sys-closed');
    });

    it('não cria uma nova hospitalização ao consultar o histórico', async () => {
        const patientService = makePatientService();
        const { wrapper } = mountView(patientService);

        await search(wrapper, 'CVL-777');

        expect(patientService.newHospitalization).not.toHaveBeenCalled();
        expect(patientService.newPatient).not.toHaveBeenCalled();
    });

    it('assinala um paciente inexistente sem abrir histórico', async () => {
        const patientService = makePatientService(
            left({ status: 404, message: 'Paciente não encontrado' }) as Either<ApiError, PatientModel>
        );
        const { wrapper, historyService } = mountView(patientService);

        await search(wrapper, 'NAO-EXISTE');

        expect(wrapper.text()).toContain('Paciente não encontrado');
        expect(wrapper.text()).not.toContain('Histórico de hospitalizações');
        expect(historyService.listByPatient).not.toHaveBeenCalled();
    });
});
