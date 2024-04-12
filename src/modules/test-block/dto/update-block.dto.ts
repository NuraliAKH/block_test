import { TestBlock } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateBlockDto implements Partial<TestBlock> {
  @IsOptional()
  length?: number;

  @IsOptional()
  correct?: number;

  @IsOptional()
  incorrect?: number;

  @IsOptional()
  result?: number;

  @IsOptional()
  userId?: number;
}
