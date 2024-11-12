import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import { User } from '../user/entity/user.entity';
import { Response as ExpressResponse } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'; // Ensure this is present
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';



@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Registro de usuario
  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email');
    }
  
    // Genera un token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');
  
    // Crea el usuario con el token de verificación
    const user = await this.usersService.createUser({ ...createUserDto, verificationToken });
  
    // Envía el correo de verificación
    const verificationLink = `http://your-app-url.com/verify?token=${verificationToken}`;
    await this.mailService.sendMail(
      createUserDto.email,
      'Verifica tu cuenta',
      'Por favor, verifica tu cuenta usando el siguiente enlace.',
      `<p>Bienvenido! Verifica tu cuenta con el siguiente enlace: <a href="${verificationLink}">Verificar cuenta</a></p>`,
    );
  
    return user;
  }
  


  // Inicio de sesión del usuario y configuración de la cookie con JWT
  async login(email: string, password: string, res: ExpressResponse): Promise<void> {
    const user = await this.usersService.validateUser(email, password); // Asume que hay un método para validar usuario
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
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

    res.status(HttpStatus.OK).json({ message: 'Login successful' });
  }

  // Cerrar sesión eliminando la cookie
  async logout(res: ExpressResponse): Promise<void> {
    res.clearCookie('Authentication');
    res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  // Verificación de correo electrónico
  async verifyEmail(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    await this.usersService.activateUser(userId);
  }

  // Obtención de usuario autenticado
  async getAuthenticatedUser(req: ExpressRequest): Promise<User> {
    const token = req.cookies['Authentication'];
    if (!token) {
      throw new UnauthorizedException('No authentication token');
    }

    const payload = this.jwtService.verify(token);
    return await this.usersService.findOne(payload.sub);
  }

  async verifyUser(token: string): Promise<User | undefined> {
    return this.usersService.verifyUser(token); // Usa usersService para verificar el usuario
  }
  
}
