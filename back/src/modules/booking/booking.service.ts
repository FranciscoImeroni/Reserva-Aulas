// booking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import { Aula } from '../aula/entities/aula.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    // Fetch Aula by ID
    const aula = await this.aulaRepository.findOneBy({ id: dto.aulaId });
    if (!aula) throw new NotFoundException(`Aula with ID ${dto.aulaId} not found`);

    // Fetch User by ID
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException(`User with ID ${dto.userId} not found`);

    // Create and save Booking
    const booking = this.bookingRepository.create({
      start: dto.start,
      end: dto.end,
      description: dto.description,
      aula, // Aula instance here
      user, // User instance here
    });

    return await this.bookingRepository.save(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({ relations: ['aula', 'user'] });
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['aula', 'user'] });
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }

// booking.service.ts
async updateBooking(id: number, dto: CreateBookingDto): Promise<Booking> {
  const booking = await this.getBookingById(id);

  // Fetch Aula and User instances
  const aula = await this.aulaRepository.findOneBy({ id: dto.aulaId });
  if (!aula) throw new NotFoundException(`Aula with ID ${dto.aulaId} not found`);

  const user = await this.userRepository.findOneBy({ id: dto.userId });
  if (!user) throw new NotFoundException(`User with ID ${dto.userId} not found`);

  // Update properties
  booking.start = dto.start;
  booking.end = dto.end;
  booking.description = dto.description;
  booking.aula = aula;
  booking.user = user;

  return await this.bookingRepository.save(booking);
}

  

  async deleteBooking(id: number): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Booking with ID ${id} not found`);
  }
}
