// booking.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Put(':id')
  async updateBooking(@Param('id') id: number, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.updateBooking(id, createBookingDto);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    return this.bookingService.deleteBooking(id);
  }
}
