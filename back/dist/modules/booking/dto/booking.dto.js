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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingDto = void 0;
// dto/booking.dto.ts
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "aulaName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "activityName", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "aulaId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "selectedVariables", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!Array.isArray(value))
            return value;
        return value.map(date => {
            if (!date)
                return null;
            return date.split('T')[0]; // Simplemente removemos la parte del tiempo si existe
        }).filter(date => date !== null);
    }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, { each: true, message: 'Las fechas deben estar en formato YYYY-MM-DD' }),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "reservationDays", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "reservationHours", void 0);
__decorate([
    (0, class_validator_1.IsUUID)() // Usamos UUID porque es el tipo de id en User
    ,
    __metadata("design:type", String)
], CreateBookingDto.prototype, "userId", void 0);
