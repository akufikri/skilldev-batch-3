// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter, // Untuk mendefinisakn struktur sebuah exception filter/error response filter
  Catch, // Menentukan exception apa yang akan ditangkap oleh filter.
  ArgumentsHost,
  HttpException, // memungkinkan filter mengambil objek request dan response HTTP.
  HttpStatus,
} from '@nestjs/common';

import { Response, Request } from 'express';

@Catch() // Menangkap semua jenis error tanpa terkecuali
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Tentukan status code: Apakah error HTTP yang disengaja atau error internal server (500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ambil pesan error-nya secara aman
    let message = 'Internal Server Error';
    if (exception instanceof HttpException) {
      const resResponse = exception.getResponse();

      message =
        typeof resResponse === 'object' && 'message' in resResponse
          ? ((resResponse as Record<string, unknown>).message as string)
          : exception.message;
    } else if (exception instanceof Error) {
      console.error('Critical system error:', exception.message);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
