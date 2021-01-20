import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { CurrentUser } from 'src/shared/decorators';
import { CreateUsuarioDto, FilterUsuarios, UpdateUsuarioDto } from 'src/shared/dtos';
import { Usuario } from 'src/shared/entities';
import { decrypt, encrypt } from 'src/shared/functions';
import { DefaultAuthGuard } from 'src/shared/guards';
import { UsuarioService } from './usuario.service';
import { resolve } from 'path';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService
  ) {}

  @Post()
  @UseGuards(DefaultAuthGuard)
  async createUsuario(@Body() usuario: CreateUsuarioDto): Promise<{ id: string }> {
    const usuarioByEmail = await this.usuarioService.indexByEmail(usuario.email)

    if (usuarioByEmail) {
      throw new ConflictException('Este e-mail já está em uso!')
    }

    const usuarioCriado = await this.usuarioService.create(usuario)

    const idEncrypted = encrypt(usuarioCriado.id)

    return { id: idEncrypted }
  }

  @Put(':id')
  @UseGuards(DefaultAuthGuard)
  async updateUsuario(
    @Param('id') id: string,
    @Body() usuario: UpdateUsuarioDto
  ): Promise<Usuario> {
    const idDecrypted = decrypt(id)

    const usuarioByEmail = await this.usuarioService.indexByEmail(usuario.email)

    if (usuarioByEmail && usuarioByEmail.id !== idDecrypted) {
      throw new ConflictException('Este e-mail já está em uso!')
    }

    const usuarioAtualizado = await this.usuarioService.update(idDecrypted, usuario)
    if (!usuarioAtualizado) {
      throw new InternalServerErrorException('Erro ao atualizar o usuário!')
    }

    return await this.usuarioService.indexByID(idDecrypted)
  }

  @Put(':id/foto')
  @UseGuards(DefaultAuthGuard)
  async updateFoto(
    @Param('id') id: string,
    @Body() { foto }: { foto: string }
  ): Promise<Boolean> {
    const idDecrypted = decrypt(id)

    const usuarioAtualizado = await this.usuarioService.updateFoto(idDecrypted, foto)

    if (!usuarioAtualizado) {
      throw new InternalServerErrorException('Erro ao atualizar a foto do usuário!')
    }

    return usuarioAtualizado
  }

  @Get('current')
  @UseGuards(DefaultAuthGuard)
  async currentUsuario(
    @CurrentUser() currentUser: Usuario
  ): Promise<Omit<Usuario, 'id'>> {
    currentUser.id = encrypt(currentUser.id)
    return currentUser
  }

  @Get(':id/foto')
  // @UseGuards(DefaultAuthGuard)
  async foto(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const idDecrypted = decrypt(id)
    const usuario = await this.usuarioService.indexByIDWithFoto(idDecrypted)

    if (usuario.foto) {
      res.setHeader('Content-Disposition', 'inline')
      res.writeHead(200)
      res.write(usuario.foto, 'utf8')
      res.end()
    } else {
      const defaultFile = process.env.NODE_ENV === 'production' ? 
          readFileSync(resolve(__dirname, '..', '..', 'shared', 'static', 'default.png')) : 
          readFileSync(resolve(__dirname, '..', '..', '..', 'src', 'shared', 'static', 'default.png'))
          
      res.setHeader('Content-Disposition', 'inline')
      res.writeHead(200)
      res.write(defaultFile, 'utf8')
      res.end()
    }

    return !!usuario.foto
  }

  @Get('list')
  @UseGuards(DefaultAuthGuard)
  async listUsuarios(@Query() params: FilterUsuarios): Promise<{ total: number, data: Usuario[] }> {
    const usuarios = await this.usuarioService.list(params)
    const total = await this.usuarioService.totalUsuarios()

    usuarios.forEach(usr => {
      usr.id = encrypt(usr.id)
    })

    return { total, data: usuarios }
  }

  @Get('list/conversa/new')
  @UseGuards(DefaultAuthGuard)
  async listUsuariosToNewConversa(
    @Query() { nome }: { nome: string },
    @CurrentUser() currentUser: Usuario
  ): Promise<{ id: string, nome: string, email: string }[]> {
    const usuarios = await this.usuarioService.listByNome(nome, currentUser.id, currentUser.master)

    usuarios.forEach(usr => {
      usr.id = encrypt(usr.id)
    })

    return usuarios
  }

  @Get(':id')
  @UseGuards(DefaultAuthGuard)
  async indexUsuario(@Param('id') id: string): Promise<Usuario> {
    const idDecrypted = decrypt(id)

    const usuario = await this.usuarioService.indexByID(idDecrypted)

    usuario.id = encrypt(usuario.id)

    if (!usuario) {
      throw new BadRequestException('Usuário não encontrado!')
    }

    return usuario
  }
}
