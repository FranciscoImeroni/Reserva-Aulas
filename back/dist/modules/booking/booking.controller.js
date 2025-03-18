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
exports.BookingController = void 0;
// booking.controller.ts
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_dto_1 = require("./dto/booking.dto");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const user_entity_1 = require("../user/entity/user.entity");
const roles_decorators_1 = require("../../Decorators/roles.decorators");
const roles_enum_1 = require("../user/dto/roles.enum");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    create(createBookingDto, user) {
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
    getAllBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookingService.getAllBookings();
        });
    }
    getBookingsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if any bookings exist for the user
                const bookings = yield this.bookingService.getBookingsByUserId(userId);
                if (!bookings || bookings.length === 0) {
                    throw new common_2.NotFoundException(`No bookings found for user with ID: ${userId}`);
                }
                return bookings;
            }
            catch (error) {
                // If error is already a NotFoundException, rethrow it
                if (error instanceof common_2.NotFoundException) {
                    throw error;
                }
                // Handle any other errors that might occur
                throw new Error(`Error fetching bookings for user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    getBookingsForDay(aulaId, fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookingService.getBookingsForDay(aulaId, fecha);
        });
    }
    /*   @Put(':id')
      async updateBooking(@Param('id') id: string, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.updateBooking(id, createBookingDto);
      }
     */
    deleteBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bookingService.deleteBooking(id);
        });
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorators_1.Roles)(roles_enum_1.Role.Admin, roles_enum_1.Role.User),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_dto_1.CreateBookingDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)('user/:userId') // Ruta: /bookings/user/:userId
    ,
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingsByUserId", null);
__decorate([
    (0, common_1.Get)('reservas/:aulaId'),
    __param(0, (0, common_1.Param)('aulaId')),
    __param(1, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getBookingsForDay", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorators_1.Roles)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "deleteBooking", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.RolesGuard),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
