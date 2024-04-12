import { IsOptional } from 'class-validator';

// CreateDTO используется для создания новой записи
export class CreateBlockDto {
  @IsOptional()
  length?: number;

  @IsOptional()
  correct?: number;

  @IsOptional()
  incorrect?: number;

  @IsOptional()
  result?: number;
}
