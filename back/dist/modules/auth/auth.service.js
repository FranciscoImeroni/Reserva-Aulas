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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../user/users.service");
const common_2 = require("@nestjs/common");
const mail_service_1 = require("../mail/mail.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    // Registro de usuario
    register(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.usersService.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new common_1.UnauthorizedException('User already exists with this email');
            }
            // Genera un token de verificación
            const verificationToken = crypto.randomBytes(32).toString('hex');
            // Crea el usuario con el token de verificación
            const user = yield this.usersService.createUser(Object.assign(Object.assign({}, createUserDto), { verificationToken }));
            // Envía el correo de verificación
            const verificationLink = `http://your-app-url.com/verify?token=${verificationToken}`;
            yield this.mailService.sendMail(createUserDto.email, 'Verifica tu cuenta', 'Por favor, verifica tu cuenta usando el siguiente enlace.', `<p>Bienvenido! Verifica tu cuenta con el siguiente enlace: <a href="${verificationLink}">Verificar cuenta</a></p>`);
            return user;
        });
    }
    // Inicio de sesión del usuario y configuración de la cookie con JWT
    login(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.validateUser(email, password); // Asume que hay un método para validar usuario
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            // Generar token JWT
            const payload = { sub: user.id };
            const token = this.jwtService.sign(payload, { expiresIn: '7d' });
            // Configurar cookie HttpOnly
            res.cookie('Authentication', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo en producción
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            });
            res.status(common_2.HttpStatus.OK).json({ message: 'Login successful' });
        });
    }
    // Cerrar sesión eliminando la cookie
    logout(res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('Authentication');
            res.status(common_2.HttpStatus.OK).json({ message: 'Logout successful' });
        });
    }
    // Verificación de correo electrónico
    verifyEmail(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOne(userId);
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            yield this.usersService.activateUser(userId);
        });
    }
    // Obtención de usuario autenticado
    getAuthenticatedUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies['Authentication'];
            if (!token) {
                throw new common_1.UnauthorizedException('No authentication token');
            }
            const payload = this.jwtService.verify(token);
            return yield this.usersService.findOne(payload.sub);
        });
    }
    verifyUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.verifyUser(token); // Usa usersService para verificar el usuario
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
