import { beforeAll, expect, mock, test } from 'bun:test';
import type { ApiClient } from '../src/lib/apiClient/api_client';
import * as either from '../src/lib/shared/either';

mock.module('@/lib/shared/either', () => either);

const alerts: unknown[] = [];
const makeDialog = () => ({
    setAttribute() {}, innerHTML: '', close() {}, showModal() {},
    querySelector: (selector: string) =>
        selector === 'textarea' ? { style: {} } : { onclick: undefined }
});

globalThis.document = {
    createElement: () => makeDialog(),
    body: { appendChild: (dialog: unknown) => alerts.push(dialog), removeChild() {} }
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

test('searching a patient escapes the clinic id in the url', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    await new PatientServiceImpl(apiClient, '/api').searchPatient('10 340/A');

    expect(urls).toEqual(['/api/patients/search/10%20340%2FA']);
});

test('unified search asks the API with the term in the query string', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: [{ systemId: 'sys-1' }] }));
        }
    } as unknown as ApiClient;

    const result = await new PatientServiceImpl(apiClient, '/api').searchPatients('Loki Tutor');

    expect(urls).toEqual(['/api/patients/search?term=Loki%20Tutor']);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) expect(result.value.length).toBe(1);
});

test('unified search keeps percent and underscore literal in the url', async () => {
    const urls: string[] = [];
    const apiClient = {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: [] }));
        }
    } as unknown as ApiClient;

    await new PatientServiceImpl(apiClient, '/api').searchPatients('100%_x');

    expect(urls).toEqual(['/api/patients/search?term=100%25_x']);
});

test('hospitalizing an existing patient sends the budget for that patient', async () => {
    alerts.length = 0;
    const calls: { url: string; body: unknown }[] = [];
    const apiClient = {
        post: (url: string, body: unknown) => {
            calls.push({ url, body });
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    const result = await new PatientServiceImpl(apiClient, '/api').newHospitalization(
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
    expect(result.isRight()).toBe(true);
    expect(alerts.length).toBe(1);
});

test('hospitalizing an existing patient reports the refusal to the user', async () => {
    alerts.length = 0;
    const apiClient = {
        post: () =>
            Promise.resolve(
                either.left({ status: 400, message: { message: 'Paciente Loki está hospitalizado' } })
            )
    } as unknown as ApiClient;

    const result = await new PatientServiceImpl(apiClient, '/api').newHospitalization(
        'sys-1',
        {} as never,
        {} as never
    );

    expect(result.isLeft()).toBe(true);
    expect(alerts.length).toBe(1);
});

test('editing the tutor sends the global fields with the hospitalization', async () => {
    alerts.length = 0;
    const calls: { url: string; body: Record<string, unknown> }[] = [];
    const apiClient = {
        post: (url: string, body: Record<string, unknown>) => {
            calls.push({ url, body });
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    await new PatientServiceImpl(apiClient, '/api').newHospitalization(
        'sys-1',
        { weight: 16.5 } as never,
        { status: 'NÃO PAGO' } as never,
        { ownerId: 'OWN-1', name: 'Novo Nome', phoneNumber: '923456789', whatsapp: false }
    );

    expect(calls[0].url).toBe('/api/patients/hospitalize');
    expect(calls[0].body.ownerData).toEqual({
        ownerId: 'OWN-1',
        name: 'Novo Nome',
        phoneNumber: '923456789',
        whatsapp: false
    });
});

test('hospitalizing without editing the tutor does not send the owner data', async () => {
    alerts.length = 0;
    const calls: { body: Record<string, unknown> }[] = [];
    const apiClient = {
        post: (_url: string, body: Record<string, unknown>) => {
            calls.push({ body });
            return Promise.resolve(either.right({ data: {} }));
        }
    } as unknown as ApiClient;

    await new PatientServiceImpl(apiClient, '/api').newHospitalization(
        'sys-1',
        { weight: 16.5 } as never,
        { status: 'NÃO PAGO' } as never
    );

    expect('ownerData' in calls[0].body).toBe(false);
});
