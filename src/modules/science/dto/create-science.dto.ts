import { IsOptional, IsString } from 'class-validator';

export class CreateScienceDto {
  @IsOptional()
  length?: number;

  @IsOptional()
  correct?: number;

  @IsOptional()
  incorrect?: number;

  @IsOptional()
  result?: number;

  @IsString()
  name: string;
}
