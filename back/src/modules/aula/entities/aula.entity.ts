// aula.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';
import { Variable } from './variable.entity';
import { AulaVariable } from './aula-variable.entity';

@Entity({ name: 'aulas' })
export class Aula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column({ default: true }) // Add this field
  visible: boolean;

  @OneToMany(() => AulaVariable, (aulaVariable) => aulaVariable.aula, { eager: true })
  aulaVariables: AulaVariable[];

  @ManyToMany(() => Variable)
  @JoinTable()
  variables: Variable[];

  @OneToMany(() => Booking, (booking) => booking.aula)
  bookings: Booking[];
  
}
