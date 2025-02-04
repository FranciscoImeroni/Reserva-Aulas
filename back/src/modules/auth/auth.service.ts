import { Injectable, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import { User } from '../user/entity/user.entity';
import { Response as ExpressResponse } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'; // Ensure this is present
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';  

dotenv.config(); 



@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email');
    }
  
    const verificationToken = crypto.randomBytes(32).toString('hex');
  
    const user = await this.usersService.createUser({
      ...createUserDto,
      role: 'Unverified', 
      verificationToken,
    });

  
    const DOMAIN_BACK = process.env.DOMAIN_BACK;
    const verificationLink = `${DOMAIN_BACK}/auth/verify?token=${verificationToken}`;
    await this.mailService.sendMail(
      createUserDto.email,
      'Verifica tu cuenta',
      'Por favor, verifica tu cuenta usando el siguiente enlace.',
      `<p>Bienvenido! Verifica tu cuenta con el siguiente enlace: <a href="${verificationLink}">Verificar cuenta</a></p>`,
    );
  
    return user;
  }
  

  async login(email: string, password: string, res: ExpressResponse): Promise<void> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.role !== 'User') {
      throw new ForbiddenException('Access restricted to users with the "User" role');
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
    
    
  
    res.status(HttpStatus.OK).json({
      message: 'Login successful - Token renewed',
      user: { email: user.email },
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
  async logout(res: ExpressResponse): Promise<void> {
    res.clearCookie('Authentication');
    res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  // Verificación de correo electrónico
  async verifyEmail(verificationToken: string): Promise<User> {
    // Busca el usuario con el token de verificación
    const user = await this.usersService.findByVerificationToken(verificationToken);
  
    if (!user) {
      throw new NotFoundException('Token de verificación no válido o expirado');
    }
  
    // Cambia el rol del usuario a "User" y elimina el token de verificación
    user.role = 'User';
    user.verificationToken = null; // Elimina el token de verificación
    await this.usersService.save(user);
    return user;
  }
  
  

  // Obtención de usuario autenticado
  async getAuthenticatedUser(req: ExpressRequest): Promise<User> {
    const token = req.cookies['Authentication'];
    if (!token) {
      throw new UnauthorizedException('No authentication token');
    }
  
    try {
      const payload = this.jwtService.verify(token); 
      return await this.usersService.findOne(payload.sub); 
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token'); 
    }
  }
  
  
}
