/* import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Variable {
@PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  esOpcional: boolean;  // Si la variable debe tener una opción de activación/desactivación
}
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Aula } from './aula.entity';

@Entity()
export class Variable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Aula, (aula) => aula.variables)
  aulas: Aula[]; // Relación ManyToMany con la entidad Aula
}
