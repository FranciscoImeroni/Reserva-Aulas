// aula.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AulaVariable } from '../entities/aula-variable.entity';
import { Booking } from '../../booking/entity/booking.entity';

@Entity({ name: 'aulas' })
export class Aula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => AulaVariable, (aulaVariable) => aulaVariable.aula, { cascade: true })
  variables: AulaVariable[];

  @OneToMany(() => Booking, (booking) => booking.aula, { cascade: true })
  bookings: Booking[];
}
