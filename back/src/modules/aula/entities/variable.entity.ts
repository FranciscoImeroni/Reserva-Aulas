import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Variable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: false })
  esOpcional: boolean;  // Si la variable debe tener una opción de activación/desactivación
}
