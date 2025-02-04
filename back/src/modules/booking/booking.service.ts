import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, In } from 'typeorm';
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
  async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const bookingUser = await this.userRepository.findOne({ where: { id: createBookingDto.userId } });
    if (!bookingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const aula = await this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
    if (!aula) {
      throw new NotFoundException(`Aula con ID ${createBookingDto.aulaId} no encontrada`);
    }

    // Convertir las fechas al formato correcto
    const formattedReservationDays = createBookingDto.reservationDays.map(date => {
      const parsedDate = new Date(date);
      return parsedDate.toISOString().split('T')[0]; // Convierte a formato YYYY-MM-DD
    });

    // Verificar que la fecha de reserva sea futura
    const bookingDate = new Date(formattedReservationDays[0]);
    const now = new Date();

    if (bookingDate < now) {
      throw new BadRequestException('No se pueden crear reservas para fechas pasadas');
    }

    // Verificar si existe una reserva que se solape para la misma aula, día y horario
    const overlappingBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.aulaId = :aulaId', { aulaId: createBookingDto.aulaId })
      .andWhere('booking.reservationDays && ARRAY[:...reservationDays]', { reservationDays: formattedReservationDays })
      .andWhere('booking.reservationHours && ARRAY[:...reservationHours]', { reservationHours: createBookingDto.reservationHours })
      .getOne();

    if (overlappingBooking) {
      throw new BadRequestException('Este horario ya está reservado para el aula seleccionada en las fechas indicadas');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user: bookingUser,
      aula,
    });

    return await this.bookingRepository.save(booking);
  }

/*     async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
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
