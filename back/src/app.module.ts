import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/user/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { User } from './modules/user/entity/user.entity';
import { AulasModule } from './modules/aula/aula.module';
import { AulaVariable } from './modules/aula/entities/aula-variable.entity';
import { Aula } from './modules/aula/entities/aula.entity';
import { Variable } from './modules/aula/entities/variable.entity';
import { BookingModule } from './modules/booking/booking.module';
import { Booking } from './modules/booking/entity/booking.entity';
// Importa tus otros módulos

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Esto hace que el ConfigModule esté disponible en toda la aplicación
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, AulaVariable, Aula, Variable, Booking],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    MailModule,
    AulasModule,
    BookingModule
    // Agrega otros módulos
  ],
})
export class AppModule {}
