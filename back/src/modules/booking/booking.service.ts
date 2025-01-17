import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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

  // Crear una nueva reserva
/*   async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    // Buscar el aula usando el ID que viene en el DTO
    const aula = await this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
    if (!aula) {
      throw new NotFoundException(`Aula with ID ${createBookingDto.aulaId} not found`);
    }

    // Crear la nueva reserva asociando el usuario autenticado
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user,  // Asocia el usuario autenticado a la reserva
      aula,  // Asocia el aula seleccionada
    });

    return await this.bookingRepository.save(booking);
  } */

    async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
      const bookingUser = await this.userRepository.findOne({ where: { id: createBookingDto.userId } });
      if (!bookingUser) {
        throw new NotFoundException('User not found');
      }
  
      const aula = await this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
      if (!aula) {
        throw new NotFoundException(`Aula with ID ${createBookingDto.aulaId} not found`);
      }

      console.log("creando reservaaaa")
  
      const booking = this.bookingRepository.create({
        ...createBookingDto,
        user: bookingUser,
        aula,
      });
  
      return await this.bookingRepository.save(booking);
    }

/*       async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking[]> {
        const bookingUser = await this.userRepository.findOne({ where: { id: createBookingDto.userId } });
        if (!bookingUser) {
          throw new NotFoundException('User not found');
        }
      
        const aula = await this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
        if (!aula) {
          throw new NotFoundException(`Aula with ID ${createBookingDto.aulaId} not found`);
        }
      
        // Verifica si las fechas están disponibles (si hay más de una)
        if (createBookingDto.reservationDays && createBookingDto.reservationDays.length > 0) {
          await this.checkAvailability(createBookingDto.reservationDays, createBookingDto.aulaId);
        }
      
        // Si está todo bien, crea las reservas
        const reservations = createBookingDto.reservationDays.map((reservationDay) => {
          return this.bookingRepository.create({
            reservationDays: [reservationDay],
            aula,
            user: bookingUser,
          });
        });
      
        return await this.bookingRepository.save(reservations);
      } */
      

  // Obtener todas las reservas
  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({ relations: ['user', 'aula'] });
  }
  

  // Obtener una reserva por ID
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'aula'], // Opcional: incluir relaciones para datos completos
      order: { createdAt: 'DESC' },
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException(`No bookings found for user with ID: ${userId}`);
    }

    return bookings;
  }

/*   async checkAvailability(dates: string[], aulaId: string, selectedSlots: string[]): Promise<void> {
    // Buscar reservas existentes en las fechas y aula dadas
    const existingReservations = await this.bookingRepository
      .createQueryBuilder('reservation')
      .where('reservation.date IN (:...dates)', { dates })
      .andWhere('reservation.aulaId = :aulaId', { aulaId })
      .getMany();
  
    // Filtrar las horas reservadas
// Replace `flatMap` with `map` + `concat`
const reservedSlots = existingReservations.map((reservation) => {
  const startHour = reservation.start.split('T')[1].slice(0, 5);
  const endHour = reservation.end.split('T')[1].slice(0, 5);
  return this.getTimeSlotsInRange(startHour, endHour);
}).reduce((acc, slots) => acc.concat(slots), []);

  
    // Verificar si algún horario seleccionado está reservado
    const conflictingSlots = selectedSlots.filter(slot => reservedSlots.includes(slot));
    if (conflictingSlots.length > 0) {
      throw new BadRequestException(
        `Las siguientes horas están reservadas: ${conflictingSlots.join(', ')}`
      );
    }
  } */
  
  private getTimeSlotsInRange(start: string, end: string): string[] {
    const slots = [];
    let startHour = parseInt(start.split(':')[0], 10);
    let startMinute = parseInt(start.split(':')[1], 10);
    let endHour = parseInt(end.split(':')[0], 10);
    let endMinute = parseInt(end.split(':')[1], 10);
  
    // Generar los slots entre la hora de inicio y fin
    while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
      const slot = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      slots.push(slot);
      startMinute += 30;
      if (startMinute === 60) {
        startMinute = 0;
        startHour += 1;
      }
    }
    return slots;
  }
  

/*   async checkAvailability(dates: string[], roomId: string): Promise<void> {
    // Buscar reservas en las fechas y aula dadas.
    const existingReservations = await this.bookingRepository
      .createQueryBuilder('reservation')
      .where('reservation.date IN (:...dates)', { dates })
      .andWhere('reservation.roomId = :roomId', { roomId })
      .getMany();

    // Si hay alguna fecha reservada, lanzamos una excepción.
    if (existingReservations.length > 0) {
      const reservedDates = existingReservations.map((r) => r.reservationDays).join(', ');
      throw new BadRequestException(
        `La(s) fecha(s) seleccionada(s) ya está(n) reservada(s): ${reservedDates}`,
      );
    }
  } */


/*  async getBookingsForDay(aulaId: string, fecha: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({
      where: { 
        aula: { id: aulaId },
        start: Like(`${fecha}%`), // Filtrar reservas por fecha (ej. '2024-04-21')
      },
    });
    return bookings;
  } */ 
  

  // Actualizar una reserva
/*   async updateBooking(id: string, dto: CreateBookingDto, user: User): Promise<Booking> {
    // Obtener la reserva por ID
    const booking = await this.getBookingById(id);

    // Buscar Aula por ID
    const aula = await this.aulaRepository.findOne({ where: { id: dto.aulaId } });
    if (!aula) throw new NotFoundException(`Aula with ID ${dto.aulaId} not found`);

    // Verifica si el usuario tiene acceso para actualizar esta reserva
    if (booking.user.id !== user.id) {
      throw new Error('You do not have permission to update this booking');
    }

    // Actualizar los valores de la reserva
    booking.start = dto.start;
    booking.end = dto.end;
    booking.description = dto.description;
    booking.aula = aula;

    return await this.bookingRepository.save(booking);
  } */

  // Eliminar una reserva
  async deleteBooking(id: number): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Booking with ID ${id} not found`);
  }
}
