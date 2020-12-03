import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shared/decorators';
import { CreateConversaDto } from 'src/shared/dtos/conversa.dto';
import { Usuario } from 'src/shared/entities';
import { Conversa } from 'src/shared/entities/conversa.entity';
import { DefaultAuthGuard } from 'src/shared/guards';
import { UsuarioService } from '../usuario/usuario.service';
import { ConversaService } from './conversa.service';

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

  @Get('usuario/:id')
  @UseGuards(DefaultAuthGuard)
  async listConversasByUser(
    @Param('id') id_usuario: string
  ): Promise<Conversa[]> {
    return await this.conversaService.listByUsuario(id_usuario)
  }
}