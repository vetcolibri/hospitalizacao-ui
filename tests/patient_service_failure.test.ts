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

test('new patient reports failure to its caller', async () => {
    const apiClient = {
        post: () => Promise.resolve(either.left({ status: 500, message: 'Falha' }))
    } as unknown as ApiClient;

    const result = await new PatientServiceImpl(apiClient, '/api').newPatient({} as never);

    expect(result.isLeft()).toBe(true);
});
