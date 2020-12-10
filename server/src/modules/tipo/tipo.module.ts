import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tipo } from '../../shared/entities';
import { TipoController } from './tipo.controller';
import { TipoService } from './tipo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tipo])
  ],
  controllers: [TipoController],
  providers: [TipoService],
  exports: [TipoService]
})
export class TipoModule {}
