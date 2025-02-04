import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Aula } from './aula.entity';

@Entity()
export class Variable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 1 })
  quantity: number; // Cantidad total disponible del recurso

  @ManyToMany(() => Aula, (aula) => aula.variables)
  aulas: Aula[]; // Mantener la relación ManyToMany con la entidad Aula
}
