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
    create(createAulaDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const aula = this.aulaRepository.create(createAulaDto);
            return yield this.aulaRepository.save(aula);
        });
    }
    updateAula(id, updateAulaDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const aula = yield this.aulaRepository.findOneBy({ id });
            if (!aula) {
                throw new common_1.NotFoundException(`Aula with ID ${id} not found`);
            }
            // Only update provided fields
            if (updateAulaDto.name !== undefined) {
                aula.name = updateAulaDto.name;
            }
            if (updateAulaDto.capacity !== undefined) {
                aula.capacity = updateAulaDto.capacity;
            }
            return yield this.aulaRepository.save(aula);
        });
    }
    /*   async getAulas(): Promise<Aula[]> {
        return await this.aulaRepository.find({ relations: ['variables'] });
      } */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aulaRepository.find();
        });
    }
    findAllVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.variableRepository.find();
        });
    }
    // CRUD para Variable
    createVariable(createVariableDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const variable = this.variableRepository.create({
                name: createVariableDto.name,
                quantity: createVariableDto.quantity
            });
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
    findAulaById(aulaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const aula = yield this.aulaRepository.findOneBy({ id: aulaId });
            if (!aula) {
                throw new common_1.NotFoundException(`Aula with ID ${aulaId} not found`);
            }
            return aula;
        });
    }
    /*   async getVariablesByAulaId(aulaId: string): Promise<Variable[]> {
        console.log('Valor de aulaId:', aulaId);
        if (!aulaId) {
          throw new Error('El ID del aula no puede ser undefined');
        }
      
        const aula = await this.aulaRepository.findOne({
          where: { id: aulaId },
          relations: ['variables'],
        });
      
        if (!aula) {
          throw new Error('Aula no encontrada');
        }
      
        console.log('Aula encontrada:', aula);
        console.log('Variables asociadas:', aula.variables);
      
        return aula.variables;
      }
       */
    getVariablesByAulaId(aulaId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Valor de aulaId:', aulaId);
            if (!aulaId) {
                throw new Error('El ID del aula no puede ser undefined');
            }
            const aula = yield this.aulaRepository.findOne({
                where: { id: aulaId },
                relations: ['aulaVariables', 'aulaVariables.variable'], // Cargar relaciones necesarias
            });
            if (!aula) {
                throw new Error('Aula no encontrada');
            }
            // Construir un arreglo de las variables con sus valores
            const variables = aula.aulaVariables.map((aulaVariable) => ({
                id: aulaVariable.variable.id,
                name: aulaVariable.variable.name,
                valor: aulaVariable.valor,
            }));
            console.log('Variables asociadas:', variables);
            return variables;
        });
    }
    getVariableNamesByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || ids.length === 0) {
                throw new common_1.BadRequestException('The ID array cannot be empty');
            }
            const variables = yield this.variableRepository.findBy({ id: (0, typeorm_2.In)(ids) });
            const names = variables.map((variable) => variable.name);
            return names.length > 0 ? names : ['Unknown Variables'];
        });
    }
    toggleAulaVisibility(aulaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const aula = yield this.aulaRepository.findOneBy({ id: aulaId });
            if (!aula) {
                throw new common_1.NotFoundException(`Aula with ID ${aulaId} not found`);
            }
            aula.visible = !aula.visible; // Toggle visibility
            return yield this.aulaRepository.save(aula);
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
