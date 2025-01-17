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
exports.Aula = void 0;
// aula.entity.ts
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("../../booking/entity/booking.entity");
const variable_entity_1 = require("./variable.entity");
const aula_variable_entity_1 = require("./aula-variable.entity");
let Aula = class Aula {
};
exports.Aula = Aula;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Aula.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Aula.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Aula.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => aula_variable_entity_1.AulaVariable, (aulaVariable) => aulaVariable.aula, { eager: true }),
    __metadata("design:type", Array)
], Aula.prototype, "aulaVariables", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => variable_entity_1.Variable),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Aula.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.aula),
    __metadata("design:type", Array)
], Aula.prototype, "bookings", void 0);
exports.Aula = Aula = __decorate([
    (0, typeorm_1.Entity)({ name: 'aulas' })
], Aula);
