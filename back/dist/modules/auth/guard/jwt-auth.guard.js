"use strict";
/* import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
 */
/*
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos para el handler actual
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // Obtener el request de contexto HTTP
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies?.['Authentication']; // Token de la cookie

    // Si no hay token, lanzar excepción no autorizada
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }

    try {
      // Verificar el token y obtener el payload
      const payload = this.jwtService.verify(token);
      request['user'] = payload; // Adjuntar el payload (usuario) al request para usarlo más adelante

      // Si no se requieren roles específicos, permitir el acceso
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Validar si el rol del usuario está entre los roles requeridos
      if (payload.role && requiredRoles.includes(payload.role)) {
        return true;
      } else {
        throw new ForbiddenException('Insufficient role permissions');
      }
    } catch (error) {
      // Manejo de errores para tokens inválidos o expirados
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.RolesGuard = void 0;
/* import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../user/dto/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => requiredRoles.some((role) => {
      const userRoleIndex = Object.values(Role).indexOf(user.role);
      const requiredRoleIndex = Object.values(Role).indexOf(role);
      return userRoleIndex >= requiredRoleIndex;
    });

    const validUser = user && user.role && hasRole();

    if (!validUser) {
      throw new ForbiddenException('No tienes los permisos necesarios para acceder a esta ruta');
    }
    return true;
  }
} */
/*
  import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../user/dto/roles.enum';  // Asegúrate de que este sea el archivo donde defines los roles
import { Roles } from '../../../Decorators/roles.decorators';  // El decorador 'Roles' que usas en el controlador

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Si no hay roles definidos, permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;  // Asegúrate de que el usuario está en la solicitud

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.some(role => user.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
 */
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const users_service_1 = require("../../user/users.service"); // Asegúrate de que este es el servicio para consultar usuarios
const roles_decorators_1 = require("../../../Decorators/roles.decorators"); // El decorador 'Roles' que usas en el controlador
let RolesGuard = class RolesGuard {
    constructor(reflector, userService) {
        this.reflector = reflector;
        this.userService = userService;
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtenemos los roles requeridos a partir del decorador `Roles`
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorators_1.Roles, [
                context.getHandler(),
                context.getClass(),
            ]);
            console.log("autenticandooo");
            // Si no se requiere ningún rol, permite el acceso
            if (!requiredRoles) {
                return true;
            }
            // Accedemos al request y obtenemos el usuario autenticado
            const request = context.switchToHttp().getRequest();
            const user = request.user; // El usuario autenticado
            // Verificamos que el usuario esté presente
            if (!user) {
                throw new common_1.ForbiddenException('No user found');
            }
            // Consultamos el usuario en la base de datos para obtener el rol real
            const dbUser = yield this.userService.findById(user.id); // Asegúrate de que el servicio tenga esta función
            // Si no encontramos el usuario en la base de datos, lanzamos una excepción
            if (!dbUser) {
                throw new common_1.ForbiddenException('User not found in database');
            }
            // Verificamos si el rol del usuario está incluido en los roles requeridos
            const hasRole = requiredRoles.some(role => dbUser.role === role); // Comparación directa de roles
            if (!hasRole) {
                throw new common_1.ForbiddenException('You do not have permission to access this resource');
            }
            // Si todo está correcto, permitimos el acceso
            return true;
        });
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        users_service_1.UsersService])
], RolesGuard);
