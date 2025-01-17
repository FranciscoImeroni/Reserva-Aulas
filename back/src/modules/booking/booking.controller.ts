// booking.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
//import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';  // Ajusta la ruta según tu estructura de directorios
import { Request } from 'express';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../user/entity/user.entity';
import { Roles } from '../../Decorators/roles.decorators';
import { Role } from '../user/dto/roles.enum';
import { RolesGuard } from '../auth/guard/jwt-auth.guard';
import { Booking } from './entity/booking.entity';



@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.Admin, Role.User)
  create(@Body() createBookingDto: CreateBookingDto, user: User) {
    console.log('Datos recibidos en el DTO:', createBookingDto);
    console.log('Usuario autenticado:', user);
    return this.bookingService.createBooking(createBookingDto, user);
  }
/* 
    @Post()
    @Roles(Role.Admin, Role.User)
    create(@Body() createBookingDto: CreateBookingDto) {
      console.log('Datos recibidos en el DTO:', createBookingDto);
      return this.bookingService.createBooking(createBookingDto);
    }
   */

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get('user/:userId') // Ruta: /bookings/user/:userId
  async getBookingsByUserId(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<Booking[]> {
    return this.bookingService.getBookingsByUserId(userId);
  }

/*   @Get('reservas/:aulaId/:fecha')
async getBookingsForDay(
  @Param('aulaId') aulaId: string,
  @Param('fecha') fecha: string,
): Promise<Booking[]> {
  return this.bookingService.getBookingsForDay(aulaId, fecha);
} */


/*   @Put(':id')
  async updateBooking(@Param('id') id: string, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.updateBooking(id, createBookingDto);
  }
 */
  @Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
