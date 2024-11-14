import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulasService } from './aula.service';
import { AulasController } from './aula.controller';
import { Aula } from './entities/aula.entity';
import { Variable } from './entities/variable.entity';
import { AulaVariable } from './entities/aula-variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Variable, AulaVariable])],
  providers: [AulasService],
  controllers: [AulasController],
})
export class AulasModule {}
