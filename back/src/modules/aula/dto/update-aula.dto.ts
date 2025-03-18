import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAulaDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}