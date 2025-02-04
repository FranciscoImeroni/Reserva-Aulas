import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as ExpressResponse, Request as ExpressRequest, request } from 'express'; // Alias de express
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entity/user.entity';
import { CurrentUser } from './current-user.decorator';
import { Roles } from '../../Decorators/roles.decorators';
import { Role } from '../user/dto/roles.enum';




@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: ExpressResponse): Promise<void> {
    const user = await this.authService.register(createUserDto);
    res.status(HttpStatus.CREATED).json(user);
  }


   @Post('login')
  async login(
    @Body('email') email: string, 
    @Body('password') password: string, 
    @Res() res: ExpressResponse // Usa el alias aquí
  ): Promise<void> {
    await this.authService.login(email, password, res);
  }

  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  
  @Post('logout')
  @Roles(Role.Admin, Role.User)
  async logout(@Res() res: ExpressResponse): Promise<void> {
    await this.authService.logout(res);
  }



  @Get('profile')
  async getProfile(@Req() req: ExpressRequest): Promise<any> {
    return await this.authService.getAuthenticatedUser(req);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res: ExpressResponse): Promise<void> {
    try {
      const user = await this.authService.verifyEmail(token);
      res.status(HttpStatus.OK).json({
        message: 'Cuenta verificada con éxito. Ahora puedes iniciar sesión.',
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
      });
}}
  }
  

