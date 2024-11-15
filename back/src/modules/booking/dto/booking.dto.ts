// dto/booking.dto.ts
import { IsNotEmpty, IsDateString, IsString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  aulaId: number; // Changed to number

  @IsNotEmpty()
  @IsString()
  userId: string; // Changed to number
}
