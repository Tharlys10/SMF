import { Body, Controller, Get, Param, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { CreateMensagemDto, CreateMensagemEConversaDto } from 'src/shared/dtos';
import { Mensagem, Usuario } from 'src/shared/entities';
import { DefaultAuthGuard } from 'src/shared/guards';
import { MensagemService } from './mensagem.service';
import { ConversaService } from '../conversa/conversa.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Pagination } from 'src/shared/@types';

@Controller('mensagem')
export class MensagemController {
  constructor(
    private mensagemService: MensagemService,
    private conversaService: ConversaService,
    private usuarioService: UsuarioService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createMensagem(
    @CurrentUser() currentUser: Usuario,
    @Body() mensagem: CreateMensagemDto
  ): Promise<{ id: string }> {
    mensagem.id_remetente = currentUser.id

    const mensagemCriada = await this.mensagemService.create(mensagem)

    return { id: mensagemCriada.id }
  }

  @Post('conversa')
  @UseGuards(DefaultAuthGuard)
  async createMensagemEConversa(
    @CurrentUser() currentUser: Usuario,
    @Body() mensagem: CreateMensagemEConversaDto
  ): Promise<{ id: string }> {
    let conversaCriada: string
    mensagem.id_remetente = currentUser.id

    if (!currentUser.master) {
      const usuario = await this.usuarioService.indexByID(mensagem.id_destinatario)
      if (!usuario.master) {
        throw new UnauthorizedException('Não é permitido criar esse tipo de conversa')
      }
    }

    // verificar se existe alguma conversa com os usuários passados
    const existeConversa = await this.conversaService.indexByUsuarios({
      id_usuario_primario: mensagem.id_remetente,
      id_usuario_secundario: mensagem.id_destinatario
    })

    if (!existeConversa) {
      const { id } = await this.conversaService.create({
        id_usuario_primario: mensagem.id_remetente,
        id_usuario_secundario: mensagem.id_destinatario,
        assunto: mensagem.assunto
      })

      conversaCriada = id
    }

    const mensagemCriada = await this.mensagemService.create({
      id_conversa: conversaCriada,
      id_remetente: mensagem.id_remetente,
      texto: mensagem.texto,
      valor: mensagem.valor,
      anexo: mensagem.anexo
    })

    return { id: mensagemCriada.id }
  }

  @Get('conversa/:id')
  // @UseGuards(DefaultAuthGuard)
  async listByConversa(
    @Param('id') id: string,
    @Query() pagination: Pagination
  ): Promise<Mensagem[]> {
    return await this.mensagemService.listByConversa(id, pagination)
  }
}
