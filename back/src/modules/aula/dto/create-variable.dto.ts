import { IsString, IsNumber, Min } from 'class-validator';

export class CreateVariableDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;
} 