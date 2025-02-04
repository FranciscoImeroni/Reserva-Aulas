// booking.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Aula } from '../aula/entities/aula.entity';
import { User } from '../user/entity/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { Variable } from '../aula/entities/variable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Aula, Variable]),
    AuthModule,
    UsersModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
