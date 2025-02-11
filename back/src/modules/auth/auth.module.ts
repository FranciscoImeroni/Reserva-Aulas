
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

import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
//import { JwtStrategy } from './guard/jwt.strategy';
import { UsersModule } from '../user/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule, // Necesario para usar ConfigService
    forwardRef(() => UsersModule), // Use forwardRef here
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Obtener JWT_SECRET del .env
        signOptions: { expiresIn: '7d' }, // Tiempo de expiración
      }),
    }),
  ],
  providers: [AuthService, MailService, JwtStrategy], // JwtStrategy
  exports: [AuthService, JwtModule], // Exportar AuthService si se usa en otros módulos
})
export class AuthModule {}
