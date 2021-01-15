import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Pagination } from 'src/shared/@types';
import { CurrentUser } from 'src/shared/decorators';
import { CreateAnexoDto } from 'src/shared/dtos';
import { Anexo, Usuario } from 'src/shared/entities';
import { DefaultAuthGuard } from 'src/shared/guards';
import { AnexoService } from './anexo.service';

@Controller('anexo')
export class AnexoController {
  constructor(
    private anexoService: AnexoService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createAnexo(
    @Body() anexo: CreateAnexoDto
  ): Promise<boolean> {
    return await this.anexoService.create(anexo)
  }

  @Post('many')
  @UseGuards(DefaultAuthGuard)
  async createAnexos(
    @Body() anexos: CreateAnexoDto[]
  ): Promise<boolean> {
    return await this.anexoService.createMany(anexos)
  }

  @Get(':id_mensagem/:sequencia/visualizar')
  @UseGuards(DefaultAuthGuard)
  async visualizeAnexoByConversa(
    @Param('id_mensagem') id_mensagem: string,
    @Param('sequencia') sequencia: number,
    @CurrentUser() currentUser: Usuario
  ): Promise<{ arquivo: string, ext: string, data_leitura: Date }> {
    await this.anexoService.visualize(id_mensagem, sequencia, currentUser.id)

    return await this.anexoService.indexWithArquivo(id_mensagem, sequencia)
  }

  @Get('mensagem/:id')
  @UseGuards(DefaultAuthGuard)
  async listByMensagem(
    @Param('id') id: string,
  ): Promise<Anexo[]> {
    return await this.anexoService.listByMensagem(id)
  }
}
