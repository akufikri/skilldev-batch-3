import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor.js';

// Helper: membuat ExecutionContext palsu (pengganti request HTTP sungguhan)
function createContext(statusCode: number, query: Record<string, string> = {}) {
  return {
    switchToHttp: () => ({
      getResponse: () => ({ statusCode }),
      getRequest: () => ({ query }),
    }),
  } as unknown as ExecutionContext;
}

// Helper: membuat CallHandler palsu yang "berpura-pura" jadi controller
function createHandler(result: unknown): CallHandler {
  return { handle: () => of(result) };
}

describe('TransformInterceptor', () => {
  const interceptor = new TransformInterceptor();

  it('membungkus data biasa ke format { statusCode, message, data }', async () => {
    const context = createContext(201);
    const handler = createHandler({ id: 1, title: 'Kopi' });

    const result = await lastValueFrom(interceptor.intercept(context, handler));

    expect(result).toEqual({
      statusCode: 201,
      message: 'Operation successful',
      data: { id: 1, title: 'Kopi' },
    });
  });

  it('menambahkan meta pagination jika ada items & totalItems', async () => {
    const context = createContext(200, { page: '2', limit: '1' });
    const handler = createHandler({ items: ['A', 'B', 'C'], totalItems: 3 });

    const result = await lastValueFrom(interceptor.intercept(context, handler));

    expect(result).toEqual({
      statusCode: 200,
      message: 'Data fetched successfully',
      data: ['A', 'B', 'C'],
      meta: { page: 2, limit: 1, totalItems: 3, totalPages: 3 },
    });
  });

  it('memakai default page 1 & limit 10 jika query kosong', async () => {
    const context = createContext(200);
    const handler = createHandler({ items: [], totalItems: 25 });

    const result = await lastValueFrom(interceptor.intercept(context, handler));

    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
    });
  });

  it('menjaga page & limit minimal 1 jika query tidak valid', async () => {
    const context = createContext(200, { page: 'abc', limit: '-5' });
    const handler = createHandler({ items: [], totalItems: 25 });

    const result = await lastValueFrom(interceptor.intercept(context, handler));

    expect(result.meta).toEqual({
      page: 1,
      limit: 1,
      totalItems: 25,
      totalPages: 25,
    });
  });
});
