import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { Variable } from './entities/variable.entity';
import { AulaVariable } from './entities/aula-variable.entity';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula) private aulaRepository: Repository<Aula>,
    @InjectRepository(Variable) private variableRepository: Repository<Variable>,
    @InjectRepository(AulaVariable) private aulaVariableRepository: Repository<AulaVariable>,
  ) {}

  // CRUD para Aula
  async createAula(nombre: string): Promise<Aula> {
    const aula = this.aulaRepository.create({ nombre });
    return await this.aulaRepository.save(aula);
  }

  async getAulas(): Promise<Aula[]> {
    return await this.aulaRepository.find({ relations: ['variables'] });
  }

  // CRUD para Variable
  async createVariable(nombre: string, esOpcional: boolean): Promise<Variable> {
    const variable = this.variableRepository.create({ nombre, esOpcional });
    return await this.variableRepository.save(variable);
  }

  // Asignar una variable a un aula
  async assignVariableToAula(aulaId: number, variableId: number, valor: string): Promise<AulaVariable> {
    // Buscar el aula y la variable
    const aula = await this.aulaRepository.findOne({ where: { id: aulaId } });
    const variable = await this.variableRepository.findOne({ where: { id: variableId } });
  
    // Verificar que ambos existan antes de continuar
    if (!aula) {
      throw new Error(`Aula with ID ${aulaId} not found`);
    }
  
    if (!variable) {
      throw new Error(`Variable with ID ${variableId} not found`);
    }
  
    // Crear la instancia de AulaVariable usando los objetos aula y variable encontrados
    const aulaVariable = this.aulaVariableRepository.create({
      aula: aula,
      variable: variable,
      valor: valor,
    });
  
    // Guardar la nueva entidad aulaVariable
    return await this.aulaVariableRepository.save(aulaVariable);
  }
}
