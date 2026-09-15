import { beforeAll, expect, mock, test } from 'bun:test';
import type { ApiClient } from '../src/lib/apiClient/api_client';
import * as either from '../src/lib/shared/either';

mock.module('@/lib/shared/either', () => either);

let HospitalizationHistoryServiceImpl: typeof import('../src/lib/services/hospitalization_history_service').HospitalizationHistoryServiceImpl;
beforeAll(async () => {
    ({ HospitalizationHistoryServiceImpl } = await import(
        '../src/lib/services/hospitalization_history_service'
    ));
});

test('listing a patient history asks the API for that patient, not the tutor link', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: [] }));
        }
    } as unknown as ApiClient;

    await new HospitalizationHistoryServiceImpl(apiClient, '/api').listByPatient('sys-1');

    expect(urls).toEqual(['/api/patients/sys-1/hospitalizations']);
});

test('opening an episode keeps both patient and episode in the url', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    const result = await new HospitalizationHistoryServiceImpl(apiClient, '/api').detail('sys-1', 'hosp 1');

    expect(urls).toEqual(['/api/patients/sys-1/hospitalizations/hosp%201']);
    expect(result.isRight()).toBe(true);
});

test('a failed detail surfaces the error to the caller', async () => {
    const apiClient = {
        get: () => Promise.resolve(either.left({ status: 404, message: 'Hospitalização não encontrada' }))
    } as unknown as ApiClient;

    const result = await new HospitalizationHistoryServiceImpl(apiClient, '/api').detail('sys-1', 'gone');

    expect(result.isLeft()).toBe(true);
});

test('the pending legacy diagnostic is an authenticated read of its own', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(
                either.right({
                    data: { reportsWithoutHospitalization: 1154, roundsWithoutHospitalization: 503 }
                })
            );
        }
    } as unknown as ApiClient;

    const result = await new HospitalizationHistoryServiceImpl(apiClient, '/api').linkStatus();

    expect(urls).toEqual(['/api/hospitalizations/legacy-link-status']);
    if (result.isRight()) {
        expect(result.value.reportsWithoutHospitalization).toBe(1154);
    }
});
