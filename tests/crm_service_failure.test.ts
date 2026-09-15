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

let CrmServiceImpl: typeof import('../src/lib/services/crm_service').CrmServiceImpl;
beforeAll(async () => {
    ({ CrmServiceImpl } = await import('../src/lib/services/crm_service'));
});

test('new report reports failure to its caller', async () => {
    const apiClient = {
        post: () => Promise.resolve(either.left({ status: 500, message: 'Falha' }))
    } as unknown as ApiClient;

    const result = await new CrmServiceImpl(apiClient, '/api').registerReport('patient-1', {} as never);

    expect(result.isLeft()).toBe(true);
});
