import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotImplementedException, Param, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { CreateMensagemDto, CreateMensagemEConversaDto } from 'src/shared/dtos';
import { Mensagem, Usuario } from 'src/shared/entities';
import { DefaultAuthGuard } from 'src/shared/guards';
import { MensagemService } from './mensagem.service';
import { ConversaService } from '../conversa/conversa.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Pagination } from 'src/shared/@types';
import { decrypt, encrypt } from 'src/shared/functions';

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
  ): Promise<any> {
    mensagem.id_remetente = currentUser.id

    return await this.mensagemService.create(mensagem)
  }

  @Post('conversa')
  @UseGuards(DefaultAuthGuard)
  async createMensagemEConversa(
    @CurrentUser() currentUser: Usuario,
    @Body() mensagem: CreateMensagemEConversaDto
  ): Promise<{ ids: string[] }> {
    let conversasCriadas: string[] = []
    let mensagensCriadas: string[] = []

    mensagem.id_remetente = currentUser.id

    mensagem.id_destinatario = mensagem.id_destinatario.map(id => decrypt(id))

    if (!currentUser.master) {
      const usuarios = await this.usuarioService.indexByIDs(mensagem.id_destinatario)

      const allNotMaster = usuarios.every(usr => !usr.master)
      if (allNotMaster) {
        throw new UnauthorizedException('Não é permitido criar esse tipo de conversa')
      }
    }

    for (let i = 0; i < mensagem.id_destinatario.length; i++) {
      const dstn = mensagem.id_destinatario[i];

      // verificar se existe alguma conversa com os usuários passados
      // const existeConversa = await this.conversaService.indexByUsuarios({
      //   id_usuario_primario: mensagem.id_remetente,
      //   id_usuario_secundario: dstn
      // })

      // if (!existeConversa) {
        const conversaCriada = await this.conversaService.create({
          id_usuario_primario: mensagem.id_remetente,
          id_usuario_secundario: dstn,
          assunto: mensagem.assunto
        })

        conversasCriadas.push(conversaCriada.id)
      // } else {
      //   conversasCriadas.push(existeConversa.id)
      // }

      let mensagemCriada = await this.mensagemService.create({
        id_conversa: conversasCriadas[i],
        id_remetente: mensagem.id_remetente,
        texto: mensagem.texto,
        valor: mensagem.valor,
        anexo: mensagem.anexo
      })

      mensagensCriadas.push(mensagemCriada.id)
    }

    return { ids: mensagensCriadas }
  }

  // @Put(':id/anexo/visualizar')
  // @UseGuards(DefaultAuthGuard)
  // async visualizeAnexoByConversa(
  //   @Param('id') id: string
  // ): Promise<Mensagem> {
  //   const mensagem = await this.mensagemService.visualizeAnexoByMensagem(id)

  //   mensagem.id_remetente = encrypt(mensagem.id_remetente)

  //   return mensagem
  // }

  @Put('conversa/:id/visualizar')
  @UseGuards(DefaultAuthGuard)
  async visualizeByConversa(
    @Param('id') id: string
  ): Promise<boolean> {
    return await this.mensagemService.visualizeAllByConversa(id)
  }

  @Get('conversa/:id')
  @UseGuards(DefaultAuthGuard)
  async listByConversa(
    @Param('id') id: string,
    @Query() pagination: Pagination,
    @CurrentUser() currentUser: Usuario
  ): Promise<Mensagem[]> {
    await this.mensagemService.viewMensagem(currentUser.id, id)

    const mensagens = await this.mensagemService.listByConversa(currentUser.id, id, pagination)

    mensagens.forEach(msg => {
      msg.id_remetente = encrypt(msg.id_remetente)
    })

    return mensagens
  }

  // @Get(':id')
  // @UseGuards(DefaultAuthGuard)
  // async index(
  //   @Param('id') id: string,
  //   @CurrentUser() currentUser: Usuario
  // ): Promise<{ id: string, anexo: string, ext: string, atualizado: boolean }> {
  //   const anexo = await this.mensagemService.indexWithAnexo(id)

  //   const atualizado = await this.mensagemService.viewAnexo(id, currentUser.id)

  //   return {
  //     ...anexo,
  //     atualizado
  //   }
  // }
}
