import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PrismaService } from 'nestjs-prisma';

@ValidatorConstraint({ name: 'isExist', async: true })
@Injectable()
export class IsExist implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  async validate(value: string, validationArguments: ValidationArguments) {
    const model = validationArguments.constraints[0] as string;
    const field = validationArguments.constraints[1]
      ? validationArguments.constraints[1]
      : validationArguments.property;

    const data = await this.prisma[model].findFirst({
      where: {
        [field]: value,
      },
    });

    return !!data;
  }

  defaultMessage() {
    return '$property is not exist';
  }
}
