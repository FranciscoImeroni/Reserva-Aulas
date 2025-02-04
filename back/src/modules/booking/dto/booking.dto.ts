// dto/booking.dto.ts
import { IsUUID, IsString, IsArray, IsOptional, IsDateString, Matches } from 'class-validator';
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
    if (Array.isArray(value)) {
      return value.map(date => {
        const parsedDate = new Date(date);
        return parsedDate.toISOString().split('T')[0];
      });
    }
    return value;
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
