import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Tipo } from 'src/shared/entities';
import { CreateTipoDto, UpdateTipoDto } from '../../shared/dtos';
import { DefaultAuthGuard } from '../../shared/guards';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
  constructor(
    private categoriaService: CategoriaService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createCategoria(
    @Body() tipo: CreateTipoDto
  ): Promise<Tipo> {
    return await this.categoriaService.create(tipo)
  }

  @Put(':id')
  @UseGuards(DefaultAuthGuard)
  async updateTipo(
    @Param('id') id: number,
    @Body() tipo: UpdateTipoDto
  ): Promise<boolean> {
    return await this.categoriaService.update(id, tipo)
  }

  @Get()
  @UseGuards(DefaultAuthGuard)
  async allTipos(): Promise<Tipo[]> {
    return await this.categoriaService.list()
  }
}
