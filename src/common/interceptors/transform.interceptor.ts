import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response as Res, Request as Req } from 'express';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPage: number;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 💡 Variabel-variabel pembongkar pintu gerbang HTTP:
    const ctx = context.switchToHttp(); // 👈 Mengubah konteks eksekusi umum NestJS menjadi konteks protokol HTTP.
    const response = ctx.getResponse<Res>(); // 👈 Mengambil objek response internal Node.js/Express (untuk mengatur status code/headers
    const request = ctx.getRequest<Req>(); // 👈 Mengambil objek request yang masuk (untuk membaca query parameter seperti ?page=1).
    const statusCode = response.statusCode; // 👈 Mengamankan status HTTP yang saat ini terjadi (misal: 200, 201).

    return next.handle().pipe(
      map((result) => {
        // Kita gunakan items dan totalItems untuk menandakan kalau response berupa pagination
        // Logika 'in' di bawah ini memeriksa secara otomatis. Jika controller mengembalikan objek dengan struktur tersebut,
        // interceptor langsung tahu bahwa ini adalah data tabel yang butuh pembagian halaman (pagination).

        if (
          result &&
          typeof result === 'object' &&
          'items' in result &&
          'totalItems' in result
        ) {
          // as memberi tahu TypeScript bahwa result berupa tipe object { items: T, totalItems: number } agar bisa didestruktur

          const { items, totalItems } = result as {
            items: T;
            totalItems: number;
          };

          const page = Math.max(1, Number(request.query.page) || 1);
          const limit = Math.max(1, Number(request.query.limit) || 10);

          return {
            statusCode,
            message: 'Data fetched successfully',
            data: items, // 👈 Array items akan ditaruh di sini
            meta: {
              page,
              limit,
              totalItems,
              totalPage: Math.ceil(totalItems / limit),
            },
          };
        }
        // 💡 Jika controller mengembalikan data biasa (bukan pagination, misal: detail satu produk atau update sukses),
        // maka data tersebut langsung dibungkus rapi ke dalam properti 'data' tanpa metadata tambahan.
        return {
          statusCode,
          message: 'Data fetched successfully',
          data: result,
        };
      }),
    );
  }
}
