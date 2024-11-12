import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/users.module'; // Importamos UsersModule
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UsersModule, // Usamos UsersModule, que ya exporta UsersService
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Asegúrate de que esto esté configurado
      signOptions: { expiresIn: '7d' },
    }),
    MailModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
