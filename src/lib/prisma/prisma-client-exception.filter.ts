import { ArgumentsHost, Catch, HttpServer, HttpStatus } from '@nestjs/common';
import { APP_FILTER, BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter} catches {@link Prisma.PrismaClientKnownRequestError} and {@link Prisma.NotFoundError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError, Prisma?.NotFoundError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping: ErrorCodesStatusMapping = null,
  ) {
    super(applicationRef);

    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception);
    const context = host.switchToHttp();
    const response = context.getResponse();

    const status = exception.code === 'P2002' ? 409 : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: context.getRequest().url,
      message: this.generatePrismaExceptionMessage(exception.code),
    });
  }

  private generatePrismaExceptionMessage(code: any) {
    const messages = {
      P2002:
        'запись, которую вы пытаетесь создать, нарушает уникальное ограничение. Проверьте уникальные поля и попробуйте снова.',
      P2003:
        'не удалось создать запись из-за нарушения внешнего ключа. Проверьте связанные данные.',
      P2004:
        'операция нарушила ограничение базы данных. Проверьте данные на соответствие ограничениям.',
      P2005:
        'предоставленное значение слишком длинное для поля. Укоротите его и попробуйте снова.',
      P2006:
        'предоставленное значение не является допустимым десятичным числом. Введите корректное число.',
      P2007:
        'предоставленное значение не является допустимым JSON. Проверьте формат и попробуйте снова.',
      P2008:
        'предоставленное значение не соответствует одному из допустимых значений перечисления. Пожалуйста, выберите допустимое значение.',
      P2009:
        'запрос не удалось разобрать. Пожалуйста, проверьте синтаксис запроса.',
      P2010:
        'значение превышает максимально допустимую длину для этого типа поля. Пожалуйста, укоротите его.',
      P2011:
        'значение меньше минимально допустимой длины для этого типа поля. Пожалуйста, удлините его.',
      P2012:
        'отсутствует обязательное значение. Пожалуйста, убедитесь, что все необходимые поля заполнены.',
      P2013:
        'отсутствует обязательный аргумент. Пожалуйста, предоставьте все необходимые аргументы.',
      P2014:
        'изменение, которое вы пытаетесь сделать, нарушит необходимую связь между данными. Пожалуйста, проверьте связи данных.',
      P2015:
        'связанная запись не может быть найдена. Пожалуйста, проверьте, что связанная запись существует.',
      P2016:
        'ошибка интерпретации запроса. Пожалуйста, пересмотрите запрос и попробуйте снова.',
      P2025: 'Запись для удаления не существует.',
    };

    const messageTemplate =
      messages[code] ||
      'Произошла неизвестная ошибка. Пожалуйста, свяжитесь с поддержкой.';

    return messageTemplate.charAt(0).toUpperCase() + messageTemplate.slice(1);
  }
}

export function providePrismaClientExceptionFilter(
  errorCodesStatusMapping?: ErrorCodesStatusMapping,
) {
  return {
    provide: APP_FILTER,
    useFactory: ({ httpAdapter }: HttpAdapterHost) => {
      return new PrismaClientExceptionFilter(
        httpAdapter,
        errorCodesStatusMapping,
      );
    },
    inject: [HttpAdapterHost],
  };
}
