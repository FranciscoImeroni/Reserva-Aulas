import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Aula } from './aula.entity';
import { Variable } from './variable.entity';

@Entity()
export class AulaVariable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Aula, (aula) => aula.variables)
  aula: Aula;

  @ManyToOne(() => Variable, (variable) => variable.aulas)
  variable: Variable;
  
  @Column()
  valor: string; // Valor asociado a la variable
}
