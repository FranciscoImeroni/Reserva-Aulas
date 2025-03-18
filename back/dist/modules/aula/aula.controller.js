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
exports.AulasController = void 0;
const common_1 = require("@nestjs/common");
const aula_service_1 = require("./aula.service");
const CreateAulaDto_dto_1 = require("./dto/CreateAulaDto.dto");
const create_variable_dto_1 = require("./dto/create-variable.dto");
const common_2 = require("@nestjs/common");
const update_aula_dto_1 = require("./dto/update-aula.dto");
let AulasController = class AulasController {
    constructor(aulasService) {
        this.aulasService = aulasService;
    }
    create(createAulaDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aulasService.create(createAulaDto);
        });
    }
    /*   @Get()
      async getAulas() {
        return await this.aulasService.getAulas();
      } */
    getAllAulas() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aulasService.findAll();
        });
    }
    getAllVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aulasService.findAllVariables();
        });
    }
    assignVariableToAula(aulaId, variableId, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aulasService.assignVariableToAula(aulaId, variableId, valor);
        });
    }
    /*
      @Post('createVariable')
      async createVariable(
        @Body('name') name: string,
      ): Promise<Variable> {
        return this.aulasService.createVariable(name);
      } */
    createVariable(createVariableDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.aulasService.createVariable(createVariableDto);
        });
    }
    getVariablesByAulaId(aulaId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Valor de aulaId:', aulaId); // Asegúrate de que se imprime correctamente
            if (!aulaId) {
                throw new common_1.BadRequestException('El ID del aula es requerido');
            }
            return yield this.aulasService.getVariablesByAulaId(aulaId);
        });
    }
    getAulaById(aulaId) {
        return this.aulasService.findAulaById(aulaId);
    }
    getVariableNames(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new common_1.HttpException('Invalid or missing IDs array', common_1.HttpStatus.BAD_REQUEST);
            }
            const names = yield this.aulasService.getVariableNamesByIds(ids);
            return { names };
        });
    }
    updateAula(id, updateAulaDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAula = yield this.aulasService.updateAula(id, updateAulaDto);
                return updatedAula;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
                }
                throw new common_1.HttpException('Unknown error occurred', common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
};
exports.AulasController = AulasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAulaDto_dto_1.CreateAulaDto]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "getAllAulas", null);
__decorate([
    (0, common_1.Get)('Variables'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "getAllVariables", null);
__decorate([
    (0, common_1.Post)(':aulaId/assignVariable'),
    __param(0, (0, common_1.Param)('aulaId')),
    __param(1, (0, common_1.Body)('variableId')),
    __param(2, (0, common_1.Body)('valor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "assignVariableToAula", null);
__decorate([
    (0, common_1.Post)('variables'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_variable_dto_1.CreateVariableDto]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "createVariable", null);
__decorate([
    (0, common_1.Get)(':aulaId/variables'),
    __param(0, (0, common_1.Param)('aulaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "getVariablesByAulaId", null);
__decorate([
    (0, common_1.Get)(':aulaId'),
    __param(0, (0, common_1.Param)('aulaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AulasController.prototype, "getAulaById", null);
__decorate([
    (0, common_1.Post)('names'),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "getVariableNames", null);
__decorate([
    (0, common_2.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_aula_dto_1.UpdateAulaDto]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "updateAula", null);
exports.AulasController = AulasController = __decorate([
    (0, common_1.Controller)('aulas'),
    __metadata("design:paramtypes", [aula_service_1.AulasService])
], AulasController);
