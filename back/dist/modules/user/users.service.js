"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    validateUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByEmail(email);
            if (!user) {
                return null;
            }
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Contraseña incorrecta');
            }
            return user;
        });
    }
    createUser(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!createUserDto.password) {
                throw new Error('Password is required');
            }
            const hashedPassword = yield bcrypt.hash(createUserDto.password, 10);
            const user = this.userRepository.create(Object.assign(Object.assign({}, createUserDto), { role: 'Unverified', password: hashedPassword }));
            return yield this.userRepository.save(user);
        });
    }
    /*
      async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new Error('User not found');
        }
    
        // Actualizamos el rol del usuario
        user.role = updateRoleDto.role; // Suponiendo que roles es un array de strings
        await this.userRepository.save(user);
    
        return user;
      } */
    updateRoleAndGenerateToken(userId, updateRoleDto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar el usuario
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }
            // Actualizar el rol del usuario
            user.role = updateRoleDto.role;
            yield this.userRepository.save(user);
            // Generar un nuevo token JWT con el rol actualizado
            const payload = { sub: user.id, roles: user.role };
            const newToken = this.jwtService.sign(payload);
            return { newToken, user };
        });
    }
    updatePasswords() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.findAll();
            for (let user of users) {
                if (!user.password.startsWith('$2b$')) {
                    const hashedPassword = yield bcrypt.hash(user.password, 10);
                    user.password = hashedPassword;
                    yield this.update(user.id, { password: hashedPassword });
                }
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        });
    }
    update(id, updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.update(id, updateUserDto);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { email } });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.userRepository.findOne({ where: { id } })) || undefined;
        });
    }
    /*   async findByVerificationToken(token: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { verificationToken: token } });
        if (!user) {
          throw new NotFoundException('Token de verificación inválido o expirado');
        }
        return user;
      } */
    findByVerificationToken(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { verificationToken } });
            if (!user) {
                throw new common_1.NotFoundException('User with verification token not found');
            }
            return user;
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.save(user);
        });
    }
    updateUserRole(userId, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('Usuario no encontrado');
            }
            user.role = newRole;
            user.verificationToken = null;
            yield this.userRepository.save(user);
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
