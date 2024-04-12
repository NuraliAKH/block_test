import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTestDto {
  @IsString()
  answer: string;

  @IsNumber()
  questionNumber: number;

  @IsOptional()
  scienceId: number;

  @IsOptional()
  blockId: number;
}
