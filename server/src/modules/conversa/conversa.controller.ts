import { Body, Controller, Get, Param, Post, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { CreateConversaDto, FilterConversa } from 'src/shared/dtos/conversa.dto';
import { Usuario } from 'src/shared/entities';
import { DefaultAuthGuard } from 'src/shared/guards';
import { UsuarioService } from '../usuario/usuario.service';
import { ConversaService } from './conversa.service';
import { decrypt, encrypt } from '../../shared/functions'

@Controller('conversa')
export class ConversaController {
  constructor(
    private conversaService: ConversaService,
    private usuarioService: UsuarioService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createConversa(
    @CurrentUser() currentUser: Usuario,
    @Body() conversa: CreateConversaDto
  ): Promise<{ id: string }> {
    conversa.id_usuario_primario = currentUser.id

    if (!currentUser.master) {
      const usuario = await this.usuarioService.indexByID(conversa.id_usuario_secundario)
      if (!usuario.master) {
        throw new UnauthorizedException('Não é permitido criar esse tipo de conversa')
      }
    }

    const conversaCriada = await this.conversaService.create(conversa)

    return { id: conversaCriada.id }
  }

  @Get('usuario/current')
  @UseGuards(DefaultAuthGuard)
  async listConversasByCurrentUser(
    @CurrentUser() currentUser: Usuario,
    @Query() params: FilterConversa
  ): Promise<any[]> {
    const idDecrypted = params.id_usuario ? decrypt(params.id_usuario) : null
    params.id_usuario = idDecrypted

    const conversas = await this.conversaService.listByUsuario(currentUser.id, params)

    conversas.forEach(cnv => {
      cnv.conversa_id_usuario_primario = encrypt(cnv.conversa_id_usuario_primario)
      cnv.conversa_id_usuario_secundario = encrypt(cnv.conversa_id_usuario_secundario)
    })

    return conversas
  }

  @Get('usuario/:id')
  @UseGuards(DefaultAuthGuard)
  async listConversasByUser(
    @Param('id') id_usuario: string
  ): Promise<any[]> {
    const idDecrypted = decrypt(id_usuario)
    return await this.conversaService.listByUsuario(idDecrypted)
  }
}