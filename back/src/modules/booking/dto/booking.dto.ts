// dto/booking.dto.ts
import { IsUUID, IsString, IsArray, IsOptional, IsDateString, Matches } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return value;
    return value.map(date => {
      if (!date) return null;
      return date.split('T')[0]; // Simplemente removemos la parte del tiempo si existe
    }).filter(date => date !== null);
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { each: true, message: 'Las fechas deben estar en formato YYYY-MM-DD' })
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
