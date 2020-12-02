import { BadRequestException, Body, ConflictException, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from 'src/shared/dtos/usuario.dto';
import { Usuario } from 'src/shared/entities';
import { decrypt } from 'src/shared/functions';
import { DefaultAuthGuard } from 'src/shared/guards';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createUser(@Body() usuario: CreateUsuarioDto): Promise<{ id: string }> {
    const usuarioByEmail = await this.usuarioService.indexByEmail(usuario.email)

    if (usuarioByEmail) {
      throw new ConflictException('Este e-mail já está em uso!')
    }

    const usuarioCriado = await this.usuarioService.create(usuario)

    return { id: usuarioCriado.id }
  }

  @Get(':id')
  @UseGuards(DefaultAuthGuard)
  async indexUser(@Param('id') id: string): Promise<Usuario> {
    const idDecrypted = decrypt(id)
    const usuario = await this.usuarioService.indexByID(idDecrypted)

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado!')
    }

    return usuario
  }
}
