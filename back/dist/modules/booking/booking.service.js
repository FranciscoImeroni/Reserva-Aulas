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
    createBooking(createBookingDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingUser = yield this.userRepository.findOne({ where: { id: createBookingDto.userId } });
            if (!bookingUser) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            const aula = yield this.aulaRepository.findOne({ where: { id: createBookingDto.aulaId } });
            if (!aula) {
                throw new common_1.NotFoundException(`Aula con ID ${createBookingDto.aulaId} no encontrada`);
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
                throw new common_1.BadRequestException('No se pueden crear reservas para fechas pasadas');
            }
            // Verificar si existe una reserva que se solape para la misma aula, día y horario
            const overlappingBooking = yield this.bookingRepository
                .createQueryBuilder('booking')
                .where('booking.aulaId = :aulaId', { aulaId: createBookingDto.aulaId })
                .andWhere('booking.reservationDays && ARRAY[:...reservationDays]', { reservationDays: formattedReservationDays })
                .andWhere('booking.reservationHours && ARRAY[:...reservationHours]', { reservationHours: createBookingDto.reservationHours })
                .getOne();
            if (overlappingBooking) {
                throw new common_1.BadRequestException('Este horario ya está reservado para el aula seleccionada en las fechas indicadas');
            }
            const booking = this.bookingRepository.create(Object.assign(Object.assign({}, createBookingDto), { user: bookingUser, aula }));
            return yield this.bookingRepository.save(booking);
        });
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
