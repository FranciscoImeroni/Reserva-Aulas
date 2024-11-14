import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Aula } from './aula.entity';
import { Variable } from './variable.entity';

@Entity()
export class AulaVariable {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Aula, (aula) => aula.variables)
  aula: Aula;

  @ManyToOne(() => Variable)
  variable: Variable;

  @Column({ nullable: true })
  valor: string; // Ej. "activado" o "apagado" para el proyector
}
