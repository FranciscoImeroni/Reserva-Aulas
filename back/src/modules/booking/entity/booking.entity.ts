// booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity'; // Asegúrate de importar la entidad User
import { Aula } from '../../aula/entities/aula.entity';

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aulaName: string;

  @Column()
  activityName: string;

  @Column('text', { array: true })
  selectedVariables: string[];

  @Column('text', { array: true })
  reservationDays: string[];

  @Column('text', { array: true })
  reservationHours: string[];

  // Relación ManyToOne con User
  @ManyToOne(() => User, (user) => user.bookings, { nullable: false }) // Define que un booking tiene un único usuario
  @JoinColumn({ name: 'userId' }) // Especifica el nombre de la columna de la clave foránea
  user: User; // Esta propiedad representará el usuario asociado a la reserva

  @ManyToOne(() => Aula, (aula) => aula.bookings, { nullable: false })
  @JoinColumn({ name: 'aulaId' })
  aula: Aula; 

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  // Add start and end properties
/*   @Column({ type: 'timestamp', nullable: true })
  start: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  end: Date | null;

  @Column({ type: 'text', nullable: true })
  description: string | null; */
}
