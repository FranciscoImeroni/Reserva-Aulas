// entity/booking.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Aula } from '../../aula/entities/aula.entity';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  description: string;

  @ManyToOne(() => Aula, (aula) => aula.bookings)
  aula: Aula;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;
}
