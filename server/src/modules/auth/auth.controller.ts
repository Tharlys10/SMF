import {
  BadRequestException,
  Controller,
  Post,
  Body
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/shared/@types';
import { LoginDto } from 'src/shared/dtos';
import { Usuario } from 'src/shared/entities';
import { encrypt } from 'src/shared/functions/cript';
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

  private async generateToken(usuario: Usuario): Promise<Token> {
    const idEncrypted = encrypt(usuario.id)

    const token = await this.jwtService.signAsync({
      id: idEncrypted
    })

    return { token }
  }
}