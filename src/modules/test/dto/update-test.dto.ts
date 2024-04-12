import { IsNumber, IsString } from 'class-validator';

export class UpdateTestDto {
  @IsString()
  answer: string;

  @IsNumber()
  questionNumber: number;
}
