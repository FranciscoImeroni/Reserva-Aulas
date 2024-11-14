"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AulasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const aula_service_1 = require("./aula.service");
const aula_controller_1 = require("./aula.controller");
const aula_entity_1 = require("./entities/aula.entity");
const variable_entity_1 = require("./entities/variable.entity");
const aula_variable_entity_1 = require("./entities/aula-variable.entity");
let AulasModule = class AulasModule {
};
exports.AulasModule = AulasModule;
exports.AulasModule = AulasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([aula_entity_1.Aula, variable_entity_1.Variable, aula_variable_entity_1.AulaVariable])],
        providers: [aula_service_1.AulasService],
        controllers: [aula_controller_1.AulasController],
    })
], AulasModule);
