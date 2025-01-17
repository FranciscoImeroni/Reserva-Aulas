"use strict";
/*

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from './guard/jwt.strategy';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';


@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, MailService], // JwtService will be automatically available because it's part of JwtModule
  exports: [AuthService], // Export AuthService if you need it in other modules
})
export class AuthModule {}

 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const mail_service_1 = require("../mail/mail.service");
//import { JwtStrategy } from './guard/jwt.strategy';
const users_module_1 = require("../user/users.module");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        imports: [
            config_1.ConfigModule, // Necesario para usar ConfigService
            (0, common_1.forwardRef)(() => users_module_1.UsersModule), // Use forwardRef here
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'), // Obtener JWT_SECRET del .env
                    signOptions: { expiresIn: '7d' }, // Tiempo de expiración
                }),
            }),
        ],
        providers: [auth_service_1.AuthService, mail_service_1.MailService], // JwtStrategy
        exports: [auth_service_1.AuthService, jwt_1.JwtModule], // Exportar AuthService si se usa en otros módulos
    })
], AuthModule);
