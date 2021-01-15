import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Tipo } from 'src/shared/entities';
import { CreateTipoDto, UpdateTipoDto } from '../../shared/dtos';
import { DefaultAuthGuard } from '../../shared/guards';
import { TipoService } from './tipo.service';

@Controller('tipo')
export class TipoController {
  constructor(
    private tipoService: TipoService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createTipo(
    @Body() tipo: CreateTipoDto
  ): Promise<Tipo> {
    return await this.tipoService.create(tipo)
  }

  @Put(':id')
  @UseGuards(DefaultAuthGuard)
  async updateTipo(
    @Param('id') id: number,
    @Body() tipo: UpdateTipoDto
  ): Promise<boolean> {
    return await this.tipoService.update(id, tipo)
  }

  @Get()
  @UseGuards(DefaultAuthGuard)
  async allTipos(): Promise<Tipo[]> {
    return await this.tipoService.list()
  }
}
