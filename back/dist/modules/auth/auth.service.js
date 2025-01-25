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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    register(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.usersService.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new common_1.UnauthorizedException('User already exists with this email');
            }
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const user = yield this.usersService.createUser(Object.assign(Object.assign({}, createUserDto), { role: 'Unverified', verificationToken }));
            const DOMAIN_BACK = process.env.DOMAIN_BACK;
            const verificationLink = `${DOMAIN_BACK}/auth/verify?token=${verificationToken}`;
            yield this.mailService.sendMail(createUserDto.email, 'Verifica tu cuenta', 'Por favor, verifica tu cuenta usando el siguiente enlace.', `<p>Bienvenido! Verifica tu cuenta con el siguiente enlace: <a href="${verificationLink}">Verificar cuenta</a></p>`);
            return user;
        });
    }
    login(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.validateUser(email, password);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            if (user.role !== 'User') {
                throw new common_1.ForbiddenException('Access restricted to users with the "User" role');
            }
            const payload = { sub: user.id, role: user.role };
            const token = this.jwtService.sign(payload, { expiresIn: '14d' });
            console.log('Token generado:', token);
            res.cookie('Authentication', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            });
            res.cookie('userEmail', user.email, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
            });
            res.cookie('userId', user.id, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(common_2.HttpStatus.OK).json({
                message: 'Login successful - Token renewed',
                user: { email: user.email },
            });
        });
    }
    /*   async login(email: string, password: string, res: ExpressResponse): Promise<void> {
        const user = await this.usersService.validateUser(email, password);
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }
      
        // Genera el token JWT con el ID del usuario
        const payload = { sub: user.id , role: user.role};
        const token = this.jwtService.sign(payload, { expiresIn: '7d' });
      
        // Configura la cookie de autenticación (JWT)
        res.cookie('Authentication', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });
      
        // Configura una cookie adicional para almacenar el email del usuario
        res.cookie('userEmail', user.email, {
          httpOnly: false, // Permite el acceso desde el cliente si es necesario
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });
    
        res.cookie('userId', user.id, {
          httpOnly: false, // Protege la cookie de ser accedida por JavaScript en el lado del cliente
          secure: process.env.NODE_ENV === 'production', // Solo se enviará en entornos seguros (HTTPS)
          maxAge: 7 * 24 * 60 * 60 * 1000, // La cookie estará disponible por 7 días
        });
        
      
        // Envía una respuesta con éxito
        res.status(HttpStatus.OK).json({
          message: 'Login successful',
          user: { email: user.email },
        });
      } */
    // Cerrar sesión eliminando la cookie
    logout(res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('Authentication');
            res.status(common_2.HttpStatus.OK).json({ message: 'Logout successful' });
        });
    }
    // Verificación de correo electrónico
    verifyEmail(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Busca el usuario con el token de verificación
            const user = yield this.usersService.findByVerificationToken(verificationToken);
            if (!user) {
                throw new common_1.NotFoundException('Token de verificación no válido o expirado');
            }
            // Cambia el rol del usuario a "User" y elimina el token de verificación
            user.role = 'User';
            user.verificationToken = null; // Elimina el token de verificación
            yield this.usersService.save(user);
            return user;
        });
    }
    // Obtención de usuario autenticado
    getAuthenticatedUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies['Authentication'];
            if (!token) {
                throw new common_1.UnauthorizedException('No authentication token');
            }
            try {
                const payload = this.jwtService.verify(token);
                return yield this.usersService.findOne(payload.sub);
            }
            catch (e) {
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
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
