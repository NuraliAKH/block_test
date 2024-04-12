// src/articles/dto/create-article.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { IsUniqueConstraint } from '../../../utils/validators/IsUniqueConstraint';
import { User } from '@prisma/client';
import { IsExist } from '@/src/utils/validators/IsExist';

export class CreateUserDto implements Partial<User> {
  @Validate(IsUniqueConstraint, ['user', 'contact'])
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998\d{9}$/)
  @ApiProperty({ required: true })
  contact: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  username: string;

  @IsNumber()
  @IsOptional()
  @Validate(IsExist, ['branch', 'id'])
  branchId?: number;
}
