import { beforeAll, expect, mock, test } from 'bun:test';
import type { ApiClient } from '../src/lib/apiClient/api_client';
import * as either from '../src/lib/shared/either';

mock.module('@/lib/shared/either', () => either);

globalThis.document = {
    createElement: () => ({
        setAttribute() {}, innerHTML: '', close() {}, showModal() {},
        querySelector: (selector: string) => selector === 'textarea' ? { style: {} } : {}
    }),
    body: { appendChild() {}, removeChild() {} }
} as unknown as Document;

let PatientServiceImpl: typeof import('../src/lib/services/patient_service').PatientServiceImpl;
beforeAll(async () => {
    ({ PatientServiceImpl } = await import('../src/lib/services/patient_service'));
});

test('searching a patient asks the API for the clinic id', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(
                either.right({
                    data: { systemId: 'sys-1', patientId: 'CVL-001', ownerId: 'owner-1' }
                })
            );
        }
    } as unknown as ApiClient;

    const result = await new PatientServiceImpl(apiClient, '/api').searchPatient('CVL-001');

    expect(urls).toEqual(['/api/patients/search/CVL-001']);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) expect(result.value.systemId).toBe('sys-1');
});

test('hospitalizing an existing patient sends the budget for that patient', async () => {
    const calls: { url: string; body: unknown }[] = [];
    const apiClient = {
        post: (url: string, body: unknown) => {
            calls.push({ url, body });
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    await new PatientServiceImpl(apiClient, '/api').newHospitalization(
        'sys-1',
        { weight: 16.5 } as never,
        { status: 'NÃO PAGO' } as never
    );

    expect(calls).toEqual([
        {
            url: '/api/patients/hospitalize',
            body: {
                patientId: 'sys-1',
                hospitalizationData: { weight: 16.5 },
                budgetData: { status: 'NÃO PAGO' }
            }
        }
    ]);
});
