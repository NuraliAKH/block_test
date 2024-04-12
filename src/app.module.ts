import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter, PrismaModule } from './lib/prisma';
import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from 'nestjs-prisma';
import { AuthModule } from './modules/auth/auth.module';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import { ResponseStatusInterceptor } from './utils/interceptors/response-status.interceptor';
import { EventsGateway } from './events/events.gateway';
import { BlockModule } from './modules/test-block/block.module';
import { ScienceModule } from './modules/science/science.module';
import { TestModule } from './modules/test/tests.module';
import { UserTestModule } from './modules/user-test/tests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    I18nModule.forRootAsync({
      resolvers: [AcceptLanguageResolver],
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '../..', 'i18n'),
          watch: true,
        },
        logging: true,
      }),
    }),
    UserModule,
    AuthModule,
    BlockModule,
    ScienceModule,
    TestModule,
    UserTestModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
    EventsGateway,
  ],
})
export class AppModule {}
