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
exports.AulasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aula_entity_1 = require("./entities/aula.entity");
const variable_entity_1 = require("./entities/variable.entity");
const aula_variable_entity_1 = require("./entities/aula-variable.entity");
let AulasService = class AulasService {
    constructor(aulaRepository, variableRepository, aulaVariableRepository) {
        this.aulaRepository = aulaRepository;
        this.variableRepository = variableRepository;
        this.aulaVariableRepository = aulaVariableRepository;
    }
    // CRUD para Aula
    createAula(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const aula = this.aulaRepository.create({ nombre });
            return yield this.aulaRepository.save(aula);
        });
    }
    getAulas() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aulaRepository.find({ relations: ['variables'] });
        });
    }
    // CRUD para Variable
    createVariable(nombre, esOpcional) {
        return __awaiter(this, void 0, void 0, function* () {
            const variable = this.variableRepository.create({ nombre, esOpcional });
            return yield this.variableRepository.save(variable);
        });
    }
    // Asignar una variable a un aula
    assignVariableToAula(aulaId, variableId, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar el aula y la variable
            const aula = yield this.aulaRepository.findOne({ where: { id: aulaId } });
            const variable = yield this.variableRepository.findOne({ where: { id: variableId } });
            // Verificar que ambos existan antes de continuar
            if (!aula) {
                throw new Error(`Aula with ID ${aulaId} not found`);
            }
            if (!variable) {
                throw new Error(`Variable with ID ${variableId} not found`);
            }
            // Crear la instancia de AulaVariable usando los objetos aula y variable encontrados
            const aulaVariable = this.aulaVariableRepository.create({
                aula: aula,
                variable: variable,
                valor: valor,
            });
            // Guardar la nueva entidad aulaVariable
            return yield this.aulaVariableRepository.save(aulaVariable);
        });
    }
};
exports.AulasService = AulasService;
exports.AulasService = AulasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(aula_entity_1.Aula)),
    __param(1, (0, typeorm_1.InjectRepository)(variable_entity_1.Variable)),
    __param(2, (0, typeorm_1.InjectRepository)(aula_variable_entity_1.AulaVariable)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AulasService);
