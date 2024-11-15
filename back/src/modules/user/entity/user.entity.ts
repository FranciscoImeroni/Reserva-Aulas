// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from '../../booking/entity/booking.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid') // UUID format for unique user IDs
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Booking, (booking) => booking.user, { cascade: true })
  bookings: Booking[];
}
