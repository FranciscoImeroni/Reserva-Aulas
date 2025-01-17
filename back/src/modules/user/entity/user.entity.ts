import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

/*   @Column()
  name: string; */

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'Unverified' })
  role: string;

  @Column({ nullable: true, type: 'text' })
  verificationToken: string | null;  

  @OneToMany(() => Booking, (booking) => booking.user, { cascade: true })
  bookings: Booking[];
}
