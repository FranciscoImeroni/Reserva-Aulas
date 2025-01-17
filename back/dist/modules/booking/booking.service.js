"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entity/booking.entity");
const aula_entity_1 = require("../aula/entities/aula.entity");
const user_entity_1 = require("../user/entity/user.entity");
let BookingService = class BookingService {
    constructor(bookingRepository, aulaRepository, userRepository) {
        this.bookingRepository = bookingRepository;
        this.aulaRepository = aulaRepository;
        this.userRepository = userRepository;
    }
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
    createBooking(createBookingDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingUser = yield this.userRepository.findOne({ where: { id: createBookingDto.userId } });
            if (!bookingUser) {
                throw new common_1.NotFoundException('User not found');
            }
            const aula = yield this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
            if (!aula) {
                throw new common_1.NotFoundException(`Aula with ID ${createBookingDto.aulaId} not found`);
            }
            console.log("creando reservaaaa");
            const booking = this.bookingRepository.create(Object.assign(Object.assign({}, createBookingDto), { user: bookingUser, aula }));
            return yield this.bookingRepository.save(booking);
        });
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
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bookingRepository.find({ relations: ['user', 'aula'] });
        });
    }
    // Obtener una reserva por ID
    getBookingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.bookingRepository.find({
                where: { user: { id: userId } },
                relations: ['user', 'aula'], // Opcional: incluir relaciones para datos completos
                order: { createdAt: 'DESC' },
            });
            if (!bookings || bookings.length === 0) {
                throw new common_1.NotFoundException(`No bookings found for user with ID: ${userId}`);
            }
            return bookings;
        });
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
    getTimeSlotsInRange(start, end) {
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
    deleteBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookingRepository.delete(id);
            if (result.affected === 0)
                throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(aula_entity_1.Aula)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
