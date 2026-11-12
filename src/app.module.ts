import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleModule } from './roles/roles.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { auditLogModule } from './audit-logs/audit-logs.module.js';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor.js';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100,
    }),
    ProductsModule,
    RoleModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    auditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
