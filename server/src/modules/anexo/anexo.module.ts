import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anexo } from '../../shared/entities';
import { AnexoController } from './anexo.controller';
import { AnexoService } from './anexo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anexo])
  ],
  controllers: [AnexoController],
  providers: [AnexoService],
  exports: [AnexoService]
})
export class AnexoModule {}
