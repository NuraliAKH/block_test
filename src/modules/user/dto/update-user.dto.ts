import { IsExist } from '@/src/utils/validators/IsExist';
import { IsUniqueConstraint } from '@/src/utils/validators/IsUniqueConstraint';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString, IsOptional, Validate, IsNumber } from 'class-validator';

export class UpdateUserDto implements Partial<User> {
  @Validate(IsUniqueConstraint, ['user', 'contact'])
  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  contact: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  username: string;

  @IsNumber()
  @IsOptional()
  @Validate(IsExist, ['branch', 'id'])
  branchId?: number;
}
