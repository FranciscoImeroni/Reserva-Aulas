import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAulaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;
}
