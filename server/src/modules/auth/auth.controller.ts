import {
  BadRequestException,
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  UnauthorizedException,
  Put
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/shared/@types';
import { LoginDto, UpdateSenhaDto } from 'src/shared/dtos';
import { Usuario } from 'src/shared/entities';
import { decrypt, encrypt } from 'src/shared/functions/cript';
import { UsuarioService } from '../usuario/usuario.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService
  ) {}

  @Post()
  async login(@Body() usuario: LoginDto): Promise<Token> {
    const usuarioByEmail = await this.usuarioService.indexByEmail(usuario.email)

    if (!usuarioByEmail) {
      throw new BadRequestException('Usuário não existe!')
    }

    const senhaIsCorrect = await usuarioByEmail.compareSenha(usuario.senha)

    if (!senhaIsCorrect) {
      throw new BadRequestException('Senha incorreta!')
    }

    return await this.generateToken(usuarioByEmail)
  }

  @Put('senha')
  async changePassword(@Body() params: UpdateSenhaDto): Promise<Token> {
    console.log(params);

    params.id = decrypt(params.id)

    const usuario = await this.usuarioService.indexByIDWithPassword(params.id)

    if (!usuario) {
      throw new BadRequestException("Usuário não encontrado.")
    }

    const match = await usuario.compareSenha(params.senha_antiga)

    if (!match) {
      throw new UnauthorizedException("A senha antiga está incorreta.")
    }

    if (params.senha_nova.length < 8) {
      throw new BadRequestException("A nova senha deve conter mais de oito caracteres.")
    }

    usuario.senha = params.senha_nova

    await usuario.hashSenha()

    const success = await this.usuarioService.updateSenha(usuario.id, usuario.senha)

    if (!success) {
      throw new InternalServerErrorException("Não foi possível alterar a senha.")
    }

    return await this.generateToken(usuario)
  }

  private async generateToken(usuario: Usuario): Promise<Token> {
    const idEncrypted = encrypt(usuario.id)

    const token = await this.jwtService.signAsync({
      id: idEncrypted
    })

    return { token }
  }
}