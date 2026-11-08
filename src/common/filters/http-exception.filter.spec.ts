import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { GlobalExceptionFilter } from './http-exception.filter.js';

// Helper: ArgumentsHost palsu dengan response.status().json() yang bisa dicek
function createHost(url = '/products') {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;

  return { host, status, json };
}

describe('GlobalExceptionFilter', () => {
  const filter = new GlobalExceptionFilter();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('memakai status & message HttpException (response berbentuk object)', () => {
    const { host, status, json } = createHost('/products/1');
    const exception = new BadRequestException(['name must be a string']);

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/products/1',
      error: ['name must be a string'],
    });
  });

  it('memakai exception.message jika response HttpException bukan object', () => {
    const { host, status, json } = createHost();

    filter.catch(new HttpException('Forbidden', HttpStatus.FORBIDDEN), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
      }),
    );
  });

  it('mengubah Error tak terduga jadi 500 dan mencatat ke console.error', () => {
    const { host, status, json } = createHost('/checkout');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    filter.catch(new Error('DB down'), host);

    expect(spy).toHaveBeenCalledWith('Critical system error:', 'DB down');
    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
      }),
    );
  });

  it('menangani nilai non-Error (string) sebagai 500 tanpa log console.error', () => {
    const { host, status, json } = createHost();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    filter.catch('boom', host);

    expect(spy).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Internal Server Error' }),
    );
  });

  it('menulis timestamp berformat ISO', () => {
    const { host, json } = createHost();

    filter.catch(new HttpException('Nope', HttpStatus.NOT_FOUND), host);

    const body = json.mock.calls[0][0] as { timestamp: string };
    expect(body.timestamp).toBe(new Date(body.timestamp).toISOString());
  });
});
