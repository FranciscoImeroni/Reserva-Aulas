"use strict";
/* import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../user/dto/roles.enum'; // Asegúrate de que este sea el archivo donde defines los roles
import { UsersService } from '../../user/users.service'; // Asegúrate de que este es el servicio para consultar usuarios
import { Roles } from '../../../Decorators/roles.decorators'; // El decorador 'Roles' que usas en el controlador

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService, // Inyectamos el servicio de usuarios
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtenemos los roles requeridos a partir del decorador `Roles`
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log("autenticandooo")

    // Si no se requiere ningún rol, permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // Accedemos al request y obtenemos el usuario autenticado
    const request = context.switchToHttp().getRequest();
    const user = request.user; // El usuario autenticado

    // Verificamos que el usuario esté presente
    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Consultamos el usuario en la base de datos para obtener el rol real
    const dbUser = await this.userService.findById(user.id); // Asegúrate de que el servicio tenga esta función

    // Si no encontramos el usuario en la base de datos, lanzamos una excepción
    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }

    // Verificamos si el rol del usuario está incluido en los roles requeridos
    const hasRole = requiredRoles.some(role => dbUser.role === role); // Comparación directa de roles
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    // Si todo está correcto, permitimos el acceso
    return true;
  }
}
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let RolesGuard = class RolesGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        console.log("Token recibido:", request.headers.authorization);
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw new common_1.UnauthorizedException('Invalid or missing token');
        }
        return user;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)()
], RolesGuard);
