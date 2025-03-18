import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { Variable } from './entities/variable.entity';
import { AulaVariable } from './entities/aula-variable.entity';
import { CreateAulaDto } from './dto/CreateAulaDto.dto';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula) private aulaRepository: Repository<Aula>,
    @InjectRepository(Variable) private variableRepository: Repository<Variable>,
    @InjectRepository(AulaVariable) private aulaVariableRepository: Repository<AulaVariable>,
  ) {}

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    const aula = this.aulaRepository.create(createAulaDto);
    return await this.aulaRepository.save(aula);
  }

  async updateAula(id: string, updateAulaDto: UpdateAulaDto): Promise<Aula> {
    const aula = await this.aulaRepository.findOneBy({ id });
    if (!aula) {
      throw new NotFoundException(`Aula with ID ${id} not found`);
    }
    
    // Only update provided fields
    if (updateAulaDto.name !== undefined) {
      aula.name = updateAulaDto.name;
    }
    if (updateAulaDto.capacity !== undefined) {
      aula.capacity = updateAulaDto.capacity;
    }
    
    return await this.aulaRepository.save(aula);
  }

  

/*   async getAulas(): Promise<Aula[]> {
    return await this.aulaRepository.find({ relations: ['variables'] });
  } */

    async findAll(): Promise<Aula[]> {
      return this.aulaRepository.find();
    }    

    async findAllVariables() {
      return this.variableRepository.find();
    }
  

  // CRUD para Variable
  async createVariable(createVariableDto: CreateVariableDto): Promise<Variable> {
    const variable = this.variableRepository.create({
      name: createVariableDto.name,
      quantity: createVariableDto.quantity
    });
    return await this.variableRepository.save(variable);
  }

  // Asignar una variable a un aula
  async assignVariableToAula(aulaId: string, variableId: string, valor: string): Promise<AulaVariable> {
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

  async findAulaById(aulaId: string): Promise<Aula> {
    const aula = await this.aulaRepository.findOneBy({ id: aulaId });
    if (!aula) {
      throw new NotFoundException(`Aula with ID ${aulaId} not found`);
    }
    return aula;
  }
  
/*   async getVariablesByAulaId(aulaId: string): Promise<Variable[]> {
    console.log('Valor de aulaId:', aulaId);
    if (!aulaId) {
      throw new Error('El ID del aula no puede ser undefined');
    }
  
    const aula = await this.aulaRepository.findOne({
      where: { id: aulaId },
      relations: ['variables'],
    });
  
    if (!aula) {
      throw new Error('Aula no encontrada');
    }
  
    console.log('Aula encontrada:', aula);
    console.log('Variables asociadas:', aula.variables);
  
    return aula.variables;
  }
   */

  async getVariablesByAulaId(aulaId: string): Promise<{ id: string; name: string; valor: string }[]> {
    console.log('Valor de aulaId:', aulaId);
  
    if (!aulaId) {
      throw new Error('El ID del aula no puede ser undefined');
    }
  
    const aula = await this.aulaRepository.findOne({
      where: { id: aulaId },
      relations: ['aulaVariables', 'aulaVariables.variable'], // Cargar relaciones necesarias
    });
  
    if (!aula) {
      throw new Error('Aula no encontrada');
    }
  
    // Construir un arreglo de las variables con sus valores
    const variables = aula.aulaVariables.map((aulaVariable) => ({
      id: aulaVariable.variable.id,
      name: aulaVariable.variable.name,
      valor: aulaVariable.valor,
    }));
  
    console.log('Variables asociadas:', variables);
    return variables;
  }

  
  async getVariableNamesByIds(ids: string[]): Promise<string[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('The ID array cannot be empty');
    }

    const variables = await this.variableRepository.findBy({ id: In(ids) });
    const names = variables.map((variable) => variable.name);

    return names.length > 0 ? names : ['Unknown Variables'];
  }
  
}
