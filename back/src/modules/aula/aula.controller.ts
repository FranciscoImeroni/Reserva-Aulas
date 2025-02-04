import { Controller, Post, Get, Body, Param, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { AulasService } from './aula.service';
import { Aula } from './entities/aula.entity';
import { CreateAulaDto } from './dto/CreateAulaDto.dto';
import { Variable } from './entities/variable.entity';
import { CreateVariableDto } from './dto/create-variable.dto';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  async create(@Body() createAulaDto: CreateAulaDto): Promise<Aula> {
    return this.aulasService.create(createAulaDto);
  }  

/*   @Get()
  async getAulas() {
    return await this.aulasService.getAulas();
  } */

    @Get()
    async getAllAulas(): Promise<Aula[]> {
      return this.aulasService.findAll();
    }

    @Get('Variables')
    async getAllVariables() {
      return this.aulasService.findAllVariables();
    }

  @Post(':aulaId/assignVariable')
  async assignVariableToAula(
    @Param('aulaId') aulaId: string,
    @Body('variableId') variableId: string,
    @Body('valor') valor: string,
  ) {
    return await this.aulasService.assignVariableToAula(aulaId, variableId, valor);
  }
/* 
  @Post('createVariable')
  async createVariable(
    @Body('name') name: string,
  ): Promise<Variable> {
    return this.aulasService.createVariable(name);
  } */

  @Post('variables')
  async createVariable(@Body() createVariableDto: CreateVariableDto) {
    return this.aulasService.createVariable(createVariableDto);
  }

  @Get(':aulaId/variables')
  async getVariablesByAulaId(@Param('aulaId') aulaId: string)/* : Promise<Variable[]> */ {
    console.log('Valor de aulaId:', aulaId); // Asegúrate de que se imprime correctamente
    if (!aulaId) {
      throw new BadRequestException('El ID del aula es requerido');
    }
    return await this.aulasService.getVariablesByAulaId(aulaId);
  }
  
  @Get(':aulaId')
  getAulaById(@Param('aulaId') aulaId: string) {
    return this.aulasService.findAulaById(aulaId);
  }

  @Post('names') 
  async getVariableNames(@Body('ids') ids: string): Promise<{ names: string[] }> {
    if (!ids || !Array.isArray(ids) || ids.length === 0) { 
      throw new HttpException('Invalid or missing IDs array', HttpStatus.BAD_REQUEST);
    }

    const names = await this.aulasService.getVariableNamesByIds(ids);
    return { names };
  }

  
}
