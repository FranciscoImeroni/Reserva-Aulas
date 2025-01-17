import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['Authentication'];  // Aquí obtienes el token desde la cookie
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;  // Decodifica el token y agrega el usuario al request
      next();
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }
  }
}
