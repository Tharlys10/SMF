import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tipo, Usuario } from '../../shared/entities';
import { In, Repository } from 'typeorm';
import { CreateUsuarioDto, FilterUsuarios, UpdateUsuarioDto } from 'src/shared/dtos';

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

  async update(id: string, usuario: UpdateUsuarioDto): Promise<Boolean> {
    usuario.nome = usuario.nome.toUpperCase()
    usuario.email = usuario.email.trim()
    usuario.contato_nome = usuario.contato_nome.toUpperCase()

    const usuarioAtualizado = await this.repo.update({ id }, usuario)

    return !!usuarioAtualizado
  }

  // esta função não retorna senha nem dados de registro
  async indexByID(id: string): Promise<Usuario> {
    return await this.repo.findOne({
      select: ['id', 'nome', 'email', 'contato_nome', 'contato_celular'],
      where: { id }
    });
  }

  async indexByIDs(ids: string[]): Promise<Usuario[]> {
    return await this.repo.find({
      select: ['id', 'nome', 'email', 'contato_nome', 'contato_celular', 'master'],
      where: { id: In(ids) }
    });
  }

  async indexByEmail(email: string): Promise<Usuario> {
    return await this.repo.findOne({ where: { email } })
  }

  async indexByIDWithPassword(id: string): Promise<Usuario> {
    return await this.repo.findOne({ where: { id } })
  }

  async list(params: FilterUsuarios): Promise<Usuario[]> {
    if (!params) {
      params = { busca: '', page: 0, limit: 10 }
    }
    let pagination = { page: params.page, limit: params.limit }

    const offset = pagination.page ? pagination.page < 0 ? 0 : pagination.page - 1 : 0
    const limit = pagination.limit ? pagination.limit < 0 ? 10 : pagination.limit : 10
    const busca = params.busca ? '%'.concat(params.busca).concat('%') : '%%'

    const caseWhereFilter = `
      CASE
        WHEN (usuario.nome ILIKE :busca) THEN TRUE
        WHEN (usuario.contato_nome ILIKE :busca) THEN TRUE
        WHEN (usuario.contato_celular ILIKE :busca) THEN TRUE
        WHEN (usuario.email ILIKE :busca) THEN TRUE
        ELSE :busca = '%%'
      END
    `

    return await this.repo.createQueryBuilder()
      .distinct()
      .select([
        'usuario.id id',
        'usuario.nome nome',
        'usuario.email email',
        'usuario.contato_nome contato_nome',
        'usuario.contato_celular contato_celular',
        'usuario.criado_em criado_em',
        'tipo.descricao tipo',
        'tipo.cor tipo_cor'
      ])
      .from(Usuario, 'usuario')
      .leftJoin(Tipo, 'tipo', 'tipo.id = usuario.id_tipo')
      .where('usuario.master = false')
      .andWhere(caseWhereFilter, { busca })
      .orderBy('usuario.nome', 'ASC')
      .offset(offset * limit)
      .limit(limit)
      .getRawMany()
  }

  async listByNome(nome: string, id: string, master: boolean): Promise<{ id: string, nome: string, email: string }[]> {
    nome = nome ? '%'.concat(nome).concat('%')  : '%%'

    const caseWhereNome = `
      CASE
        WHEN (usuario.nome ILIKE :nome) THEN TRUE
        ELSE :nome = '%%'
      END
    `
    const caseWhereMaster = master ? 'usuario.master IS NOT NULL' : 'usuario.master = TRUE'

    return await this.repo.createQueryBuilder()
      .distinct()
      .select([
        'usuario.id id',
        'usuario.nome nome',
        'usuario.email email',
        'tipo.descricao tipo',
        'tipo.cor tipo_cor'
      ])
      .from(Usuario, 'usuario')
      .leftJoin(Tipo, 'tipo', 'tipo.id = usuario.id_tipo')
      .where('usuario.id <> :id', { id })
      .andWhere(caseWhereNome, { nome })
      .andWhere(caseWhereMaster)
      .orderBy('usuario.nome', 'ASC')
      .limit(50)
      .getRawMany()
  }

  async totalUsuarios(): Promise<number> {
    const usuarios = await this.repo.find({ select: ['id'] })
    return usuarios.length
  }
}
