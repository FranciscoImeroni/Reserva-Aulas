// dto/booking.dto.ts
import { IsUUID, IsString, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  aulaName: string;

  @IsString()
  activityName: string;

  @IsUUID()
  aulaId: string;
  
  @IsArray()
  selectedVariables: string[];

  @IsArray()
  reservationDays: string[];

  @IsArray()
  reservationHours: string[];

  @IsUUID() // Usamos UUID porque es el tipo de id en User
  userId: string; // El ID del usuario que hace la reserva

/*   @IsOptional()
  @IsDateString()
  start?: Date;

  @IsOptional()
  @IsDateString()
  end?: Date;

  @IsOptional()
  @IsString()
  description?: string; */
}
