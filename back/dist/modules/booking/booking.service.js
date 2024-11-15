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
// booking.service.ts
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
    createBooking(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch Aula by ID
            const aula = yield this.aulaRepository.findOneBy({ id: dto.aulaId });
            if (!aula)
                throw new common_1.NotFoundException(`Aula with ID ${dto.aulaId} not found`);
            // Fetch User by ID
            const user = yield this.userRepository.findOneBy({ id: dto.userId });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found`);
            // Create and save Booking
            const booking = this.bookingRepository.create({
                start: dto.start,
                end: dto.end,
                description: dto.description,
                aula, // Aula instance here
                user, // User instance here
            });
            return yield this.bookingRepository.save(booking);
        });
    }
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.bookingRepository.find({ relations: ['aula', 'user'] });
        });
    }
    getBookingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this.bookingRepository.findOne({ where: { id }, relations: ['aula', 'user'] });
            if (!booking)
                throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
            return booking;
        });
    }
    // booking.service.ts
    updateBooking(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this.getBookingById(id);
            // Fetch Aula and User instances
            const aula = yield this.aulaRepository.findOneBy({ id: dto.aulaId });
            if (!aula)
                throw new common_1.NotFoundException(`Aula with ID ${dto.aulaId} not found`);
            const user = yield this.userRepository.findOneBy({ id: dto.userId });
            if (!user)
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found`);
            // Update properties
            booking.start = dto.start;
            booking.end = dto.end;
            booking.description = dto.description;
            booking.aula = aula;
            booking.user = user;
            return yield this.bookingRepository.save(booking);
        });
    }
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
