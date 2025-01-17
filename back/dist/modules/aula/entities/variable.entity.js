"use strict";
/* import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Variable {
@PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  esOpcional: boolean;  // Si la variable debe tener una opción de activación/desactivación
}
 */
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
exports.Variable = void 0;
const typeorm_1 = require("typeorm");
const aula_entity_1 = require("./aula.entity");
let Variable = class Variable {
};
exports.Variable = Variable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Variable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Variable.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => aula_entity_1.Aula, (aula) => aula.variables),
    __metadata("design:type", Array)
], Variable.prototype, "aulas", void 0);
exports.Variable = Variable = __decorate([
    (0, typeorm_1.Entity)()
], Variable);
