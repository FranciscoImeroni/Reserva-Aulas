import { Controller, Get, Post, Body, Param, Patch, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './dto/roles.enum';
import { Roles } from '../../Decorators/roles.decorators';
import { UpdateRoleDto } from './dto/UpdateRoleDto.dto';
import { JwtService } from '@nestjs/jwt';
//import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // Ensure jwtService is injected

  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

/*   @Patch('change-role/:id')
  @Roles(Role.Admin)
  async changeRole(
    @Param('id') userId: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    const updatedUser = await this.usersService.updateRole(userId, updateRoleDto);

    // Generar el nuevo token con el rol actualizado
    const payload = { sub: updatedUser.id, roles: updatedUser.role };
    const newToken = this.jwtService.sign(payload);

    return { newToken };
  } */

    @Patch('change-role/:id')
    @Roles(Role.Admin)
    async changeRole(
      @Param('id') userId: string,
      @Body() updateRoleDto: UpdateRoleDto,
      @Res() res: Response, // Asegúrate de usar Response de express
    ) {
      // Delegar la lógica de negocio al servicio
      const { newToken, user } = await this.usersService.updateRoleAndGenerateToken(userId, updateRoleDto);
  
      res.cookie('Authentication', newToken, {
        httpOnly: true,  // Para evitar acceso desde JavaScript en el navegador
        secure: process.env.NODE_ENV === 'production',  // Solo habilitar en producción
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 días de duración
      });
  
      // Devolver la respuesta
      return res.send({
        message: 'Role updated and token stored in cookie',
        user,  // Puedes devolver el usuario actualizado si es necesario
      });
    }
 

/*   @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  } */


    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
      return this.usersService.remove(id);
    }
}
