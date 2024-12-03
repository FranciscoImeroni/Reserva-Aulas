import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AulasService } from './aula.service';
import { Aula } from './entities/aula.entity';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  async createAula(@Body('nombre') name: string) {
    return await this.aulasService.createAula(name);
  }

/*   @Get()
  async getAulas() {
    return await this.aulasService.getAulas();
  } */

  @Get()
findAll(): Promise<Aula[]> {
  return this.aulasService.findAll();
}


  @Post(':aulaId/variable')
  async assignVariableToAula(
    @Param('aulaId') aulaId: string,
    @Body('variableId') variableId: number,
    @Body('valor') valor: string,
  ) {
    return await this.aulasService.assignVariableToAula(aulaId, variableId, valor);
  }
}
