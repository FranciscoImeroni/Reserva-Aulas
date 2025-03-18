// booking.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
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
import { NotFoundException } from '@nestjs/common';

@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.Admin, Role.User)
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: User)  {
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
    try {
      // Check if any bookings exist for the user
      const bookings = await this.bookingService.getBookingsByUserId(userId);
      
      if (!bookings || bookings.length === 0) {
        throw new NotFoundException(`No bookings found for user with ID: ${userId}`);
      }
      
      return bookings;
    } catch (error) {
      // If error is already a NotFoundException, rethrow it
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Handle any other errors that might occur
      throw new Error(`Error fetching bookings for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  @Get('reservas/:aulaId')
  async getBookingsForDay(
    @Param('aulaId') aulaId: string,
    @Query('fecha') fecha: string,
  ): Promise<{ reservedSlots: string[] }> {
    return this.bookingService.getBookingsForDay(aulaId, fecha);
  }

/*   @Put(':id')
  async updateBooking(@Param('id') id: string, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.updateBooking(id, createBookingDto);
  }
 */
  @Delete(':id')
  @Roles(Role.Admin)
  async deleteBooking(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
