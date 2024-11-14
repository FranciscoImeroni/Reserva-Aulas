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
let AulasController = class AulasController {
    constructor(aulasService) {
        this.aulasService = aulasService;
    }
    createAula(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aulasService.createAula(nombre);
        });
    }
    getAulas() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aulasService.getAulas();
        });
    }
    assignVariableToAula(aulaId, variableId, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.aulasService.assignVariableToAula(aulaId, variableId, valor);
        });
    }
};
exports.AulasController = AulasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('nombre')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "createAula", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "getAulas", null);
__decorate([
    (0, common_1.Post)(':aulaId/variable'),
    __param(0, (0, common_1.Param)('aulaId')),
    __param(1, (0, common_1.Body)('variableId')),
    __param(2, (0, common_1.Body)('valor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AulasController.prototype, "assignVariableToAula", null);
exports.AulasController = AulasController = __decorate([
    (0, common_1.Controller)('aulas'),
    __metadata("design:paramtypes", [aula_service_1.AulasService])
], AulasController);
