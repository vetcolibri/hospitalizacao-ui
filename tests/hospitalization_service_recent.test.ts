import { beforeAll, expect, mock, test } from 'bun:test';
import type { ApiClient } from '../src/lib/apiClient/api_client';
import * as either from '../src/lib/shared/either';

mock.module('@/lib/shared/either', () => either);

let HospitalizationServiceImpl: typeof import('../src/lib/services/hospitalization_service').HospitalizationServiceImpl;
beforeAll(async () => {
    ({ HospitalizationServiceImpl } = await import('../src/lib/services/hospitalization_service'));
});

function makeClient(urls: string[]) {
    return {
        get: (url: string) => {
            urls.push(url);
            return Promise.resolve(either.right({ data: [{ hospitalizationId: 'h-1' }] }));
        }
    } as unknown as ApiClient;
}

test('sem filtros pede os últimos internamentos sem query string', async () => {
    const urls: string[] = [];

    const result = await new HospitalizationServiceImpl(makeClient(urls), '/api').recent({});

    expect(urls).toEqual(['/api/hospitalizations/recent']);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) expect(result.value.length).toBe(1);
});

test('envia termo e intervalo de datas na query string', async () => {
    const urls: string[] = [];

    await new HospitalizationServiceImpl(makeClient(urls), '/api').recent({
        term: 'Loki Tutor',
        from: '2026-01-01',
        to: '2026-01-31'
    });

    expect(urls).toEqual([
        '/api/hospitalizations/recent?term=Loki+Tutor&from=2026-01-01&to=2026-01-31'
    ]);
});

test('percentagem e underscore vão codificados mas literais', async () => {
    const urls: string[] = [];

    await new HospitalizationServiceImpl(makeClient(urls), '/api').recent({ term: '100%_x' });

    expect(urls).toEqual(['/api/hospitalizations/recent?term=100%25_x']);
});
