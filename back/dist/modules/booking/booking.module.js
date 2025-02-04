"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
// booking.module.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entity/booking.entity");
const booking_service_1 = require("./booking.service");
const booking_controller_1 = require("./booking.controller");
const aula_entity_1 = require("../aula/entities/aula.entity");
const user_entity_1 = require("../user/entity/user.entity");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../user/users.module");
const variable_entity_1 = require("../aula/entities/variable.entity");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, user_entity_1.User, aula_entity_1.Aula, variable_entity_1.Variable]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        providers: [booking_service_1.BookingService],
        controllers: [booking_controller_1.BookingController],
    })
], BookingModule);
