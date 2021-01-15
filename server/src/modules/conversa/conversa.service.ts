import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConversaDto, FilterConversa } from 'src/shared/dtos/conversa.dto';
import { Categoria, Usuario } from 'src/shared/entities';
import { Conversa } from 'src/shared/entities/conversa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversaService {
  constructor(
    @InjectRepository(Conversa) private repo: Repository<Conversa>
  ) {}

  async create(conversa: CreateConversaDto): Promise<Conversa> {
    return await this.repo.save(this.repo.create(conversa))
  }

  async indexByUsuarios(
    { id_usuario_primario, id_usuario_secundario }: { id_usuario_primario: string, id_usuario_secundario: string }
  ): Promise<Conversa> {
    return await this.repo.findOne({
      select: ['id'],
      where: [
        { id_usuario_primario, id_usuario_secundario },
        { id_usuario_primario: id_usuario_secundario, id_usuario_secundario: id_usuario_primario },
      ]
    })
  }

  async listByUsuario(id_usuario_atual: string, params?: FilterConversa): Promise<any[]> {
    const uuidFake = '00000000-0000-0000-0000-000000000000'

    params = params ? params : { assunto: params.assunto, id_categoria: -1, id_usuario: uuidFake, status: 0 }

    const assunto = params.assunto ? '%'.concat(params.assunto).concat('%') : '%%'
    const id_categoria = params.id_categoria || -1
    const id_usuario = params.id_usuario || uuidFake
    const status = params.status || 0

    const caseAssuntoWhere = `
      CASE
        WHEN (:assunto = '%%') THEN TRUE
        ELSE conversa.assunto ILIKE :assunto
      END
    `
    const caseCategoriaWhere = `
      CASE
        WHEN (:id_categoria = -1) THEN true
        ELSE conversa.id_categoria = :id_categoria
      END
    `
    const caseUsuarioWhere = `
      CASE
        WHEN (:id_usuario = '${uuidFake}') THEN true
        ELSE conversa.id_usuario_secundario = :id_usuario
      END
    `
    const naoLidasWhere = status == 0
      // traz todas as conversas independente das leituras
      ? 'conversa.id IS NOT NULL'
      : status == 1
        // traz todas as conversas com mensagens não lidas
        ? `(SELECT count(*) FROM mensagem m WHERE m.id_conversa = conversa.id AND m.id_remetente <> '${id_usuario_atual}' AND data_leitura IS NULL)::integer = 0`
        // traz todas as conversas sem mensagens não lidas
        : `(SELECT count(*) FROM mensagem m WHERE m.id_conversa = conversa.id AND m.id_remetente <> '${id_usuario_atual}' AND data_leitura IS NULL)::integer > 0`

    return await this.repo.createQueryBuilder('conversa')
      .distinct()
      .select([
        'conversa.id',
        'conversa.assunto',
        'conversa.data_inicio',
        'conversa.id_usuario_primario',
        'conversa.id_usuario_secundario',
        'usuario_p.nome',
        'usuario_s.nome',
        'categoria.id id_categoria',
        'categoria.descricao categoria',
        'categoria.cor categoria_cor',
        '(SELECT data_envio FROM mensagem m WHERE m.id_conversa = conversa.id ORDER BY m.data_envio DESC LIMIT 1) data_ultima_mensagem',
        `(SELECT count(*) FROM mensagem m WHERE m.id_conversa = conversa.id AND m.id_remetente <> '${id_usuario_atual}' AND data_leitura IS NULL)::integer total_nao_lidas`
      ])
      .leftJoin(Usuario, 'usuario_p', 'usuario_p.id = conversa.id_usuario_primario')
      .leftJoin(Usuario, 'usuario_s', 'usuario_s.id = conversa.id_usuario_secundario')
      .leftJoin(Categoria, 'categoria', 'categoria.id = conversa.id_categoria')
      .where('(conversa.id_usuario_primario = :usuario OR conversa.id_usuario_secundario = :usuario)', { usuario: id_usuario_atual })
      .andWhere(caseAssuntoWhere, { assunto })
      .andWhere(caseCategoriaWhere, { id_categoria })
      .andWhere(caseUsuarioWhere, { id_usuario })
      .andWhere(naoLidasWhere)
      .orderBy('data_ultima_mensagem', 'DESC')
      .getRawMany()
  }
}
