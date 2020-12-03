import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../shared/entities';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from 'src/shared/dtos';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private repo: Repository<Usuario>
  ) {}

  async create(usuario: CreateUsuarioDto): Promise<Usuario> {
    usuario.nome = usuario.nome.toUpperCase()
    usuario.email = usuario.email.trim()
    usuario.contato_nome = usuario.contato_nome.toUpperCase()

    return await this.repo.save(this.repo.create(usuario))
  }

  // esta função não retorna senha nem dados de registro
  async indexByID(id: string): Promise<Usuario> {
    return await this.repo.findOne({
      select: ['id', 'nome', 'email', 'contato_nome', 'contato_celular'],
      where: { id }
    });
  }

  async indexByEmail(email: string): Promise<Usuario> {
    return await this.repo.findOne({ where: { email } })
  }

  async indexByIDWithPassword(id: string): Promise<Usuario> {
    return await this.repo.findOne({ where: { id } })
  }
}
