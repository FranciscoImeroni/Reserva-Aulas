import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AulasService } from './aula.service';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Post()
  async createAula(@Body('nombre') nombre: string) {
    return await this.aulasService.createAula(nombre);
  }

  @Get()
  async getAulas() {
    return await this.aulasService.getAulas();
  }

  @Post(':aulaId/variable')
  async assignVariableToAula(
    @Param('aulaId') aulaId: number,
    @Body('variableId') variableId: number,
    @Body('valor') valor: string,
  ) {
    return await this.aulasService.assignVariableToAula(aulaId, variableId, valor);
  }
}
