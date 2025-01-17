"use strict";
/* import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../user/users.service';  // Ajusta la ruta si es necesario
import { User } from '../../user/entity/user.entity';  // Ajusta la ruta si es necesario
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrae el token desde la cabecera Authorization
      secretOrKey: process.env.JWT_SECRET,  // La clave secreta para verificar el JWT
    });
  }

  async validate(payload: any): Promise<User> {
    console.log('Payload decodificado del JWT:', payload);

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      console.error('Error: Usuario no encontrado');
      throw new Error('User not found');
    }

    console.log('Usuario validado:', user);
    return user;
  }
}
 */ 
