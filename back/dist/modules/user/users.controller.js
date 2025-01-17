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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const roles_enum_1 = require("./dto/roles.enum");
const roles_decorators_1 = require("../../Decorators/roles.decorators");
const UpdateRoleDto_dto_1 = require("./dto/UpdateRoleDto.dto");
const jwt_1 = require("@nestjs/jwt");
let UsersController = class UsersController {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    create(createUserDto) {
        return this.usersService.createUser(createUserDto);
    }
    findAll() {
        return this.usersService.findAll();
    }
    /*   @Patch('change-role/:id')
      @Roles(Role.Admin)
      async changeRole(
        @Param('id') userId: string,
        @Body() updateRoleDto: UpdateRoleDto
      ) {
        const updatedUser = await this.usersService.updateRole(userId, updateRoleDto);
    
        // Generar el nuevo token con el rol actualizado
        const payload = { sub: updatedUser.id, roles: updatedUser.role };
        const newToken = this.jwtService.sign(payload);
    
        return { newToken };
      } */
    changeRole(userId, updateRoleDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delegar la lógica de negocio al servicio
            const { newToken, user } = yield this.usersService.updateRoleAndGenerateToken(userId, updateRoleDto);
            res.cookie('Authentication', newToken, {
                httpOnly: true, // Para evitar acceso desde JavaScript en el navegador
                secure: process.env.NODE_ENV === 'production', // Solo habilitar en producción
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días de duración
            });
            // Devolver la respuesta
            return res.send({
                message: 'Role updated and token stored in cookie',
                user, // Puedes devolver el usuario actualizado si es necesario
            });
        });
    }
    /*   @Get(':id')
      findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
      }
    
      @Patch(':id')
      update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
      } */
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('change-role/:id'),
    (0, roles_decorators_1.Roles)(roles_enum_1.Role.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRoleDto_dto_1.UpdateRoleDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], UsersController);
