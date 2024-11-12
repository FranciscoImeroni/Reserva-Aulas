import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express'; // Alias de express
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto, 
    @Res() res: ExpressResponse
  ): Promise<void> {
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

  @Post('logout')
  async logout(@Res() res: ExpressResponse): Promise<void> {
    await this.authService.logout(res);
  }

  @Get('verify-email/:userId')
  async verifyEmail(
    @Param('userId') userId: string, 
    @Res() res: ExpressResponse
  ): Promise<void> {
    await this.authService.verifyEmail(userId);
    res.status(HttpStatus.OK).json({ message: 'Email verified successfully' });
  }

  @Get('profile')
  async getProfile(@Req() req: ExpressRequest): Promise<any> {
    return await this.authService.getAuthenticatedUser(req);
  }

  @Get('verify')
  async verifyAccount(@Query('token') token: string): Promise<{ message: string }> {
    const user = await this.authService.verifyUser(token); // Llama a verifyUser de AuthService
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Account verified successfully' };
  }
}
