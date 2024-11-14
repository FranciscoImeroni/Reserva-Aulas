import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AulaVariable } from '../entities/aula-variable.entity';

@Entity()
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => AulaVariable, (aulaVariable) => aulaVariable.aula, { cascade: true })
  variables: AulaVariable[];
}
