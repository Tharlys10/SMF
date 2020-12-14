import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/shared/@types';
import { CreateMensagemDto } from 'src/shared/dtos';
import { Anexo } from 'src/shared/entities';
import { Mensagem } from 'src/shared/entities/mensagem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MensagemService {
  constructor(
    @InjectRepository(Mensagem) private repo: Repository<Mensagem>
  ) {}

  async create(mensagem: CreateMensagemDto): Promise<any> {
    const { id, id_remetente } = await this.repo.save(this.repo.create(mensagem))

    const caseAnexoSelect = `
      (SELECT COUNT(*) FROM anexo WHERE anexo.id_mensagem = mensagem.id)::integer anexos
    `
    const caseRemetenteSelect = `
      CASE
        WHEN mensagem.id_remetente = '${id_remetente}' THEN true
        ELSE false
      END AS e_remetente
    `

    return await this.repo.createQueryBuilder()
      .select([
        'mensagem.id id',
        'mensagem.id_conversa id_conversa',
        'mensagem.id_remetente id_remetente',
        caseRemetenteSelect,
        caseAnexoSelect,
        'mensagem.texto texto',
        'mensagem.data_leitura data_leitura',
        'mensagem.data_envio data_envio'
      ])
      .from(Mensagem, 'mensagem')
      .leftJoin(Anexo, 'anexo', 'anexo.id_mensagem = mensagem.id')
      .where('mensagem.id = :id', { id })
      .getRawOne()
  }

  async visualizeAllByConversa(id_conversa: string): Promise<boolean> {
    const updated = await this.repo.createQueryBuilder()
      .update(Mensagem)
      .set({ data_leitura: new Date() })
      .where('id_conversa = :id', { id: id_conversa })
      .andWhere('data_leitura IS NULL')
      .execute()

    return !!updated.affected
  }

  async index(id: string): Promise<Mensagem> {
    const [mensagem] = await this.repo.query(`
      SELECT
        mensagem.id,
        mensagem.texto,
        mensagem.data_leitura,
        mensagem.data_envio,
        COUNT(anexo.sequencia)::integer anexos,
        CASE
          WHEN (COUNT(anexo.*) > 0)
          THEN
            json_agg(
              (SELECT row_to_json(_) FROM (SELECT anexo.sequencia, anexo.instrucao, anexo.data_validade, anexo.valor, anexo.data_leitura) as _) ORDER BY anexo.sequencia
            )
          ELSE '[]'::json
        END dados_anexos
      FROM mensagem
      LEFT JOIN anexo ON anexo.id_mensagem = mensagem.id
      WHERE mensagem.id = $1
      GROUP BY mensagem.id, mensagem.texto, mensagem.data_leitura, mensagem.data_envio
    `, [ id ])

    return mensagem
  }

  async viewMensagem(id_usuario: string, id_conversa: string): Promise<boolean> {
    const updated = await this.repo.createQueryBuilder()
      .update(Mensagem)
      .set({ data_leitura: new Date() })
      .where('id_remetente <> :id', { id: id_usuario })
      .andWhere('id_conversa = :id_conversa', { id_conversa })
      .andWhere('data_leitura IS NULL')
      .execute()

    return !!updated.affected
  }

  async listByConversa(id_usuario: string, id_conversa: string, pagination: Pagination): Promise<any[]> {
    if (!pagination) {
      pagination = { page: 0, limit: 50 }
    }

    const offset = pagination.page ? pagination.page < 0 ? 0 : pagination.page - 1 : 0
    const limit = pagination.limit ? pagination.limit < 0 ? 50 : pagination.limit : 50

    return await this.repo.query(`
    SELECT
      mensagem.id,
      mensagem.id_conversa,
      mensagem.id_remetente,
      CASE
        WHEN mensagem.id_remetente = '${id_usuario}' THEN true
        ELSE false
      END e_remetente,
      mensagem.texto,
      mensagem.data_leitura,
      mensagem.data_envio,
      COUNT(anexo.sequencia)::integer anexos,
      CASE
        WHEN (COUNT(anexo.*) > 0)
        THEN
          json_agg(
            (SELECT row_to_json(_) FROM (SELECT anexo.sequencia, anexo.instrucao, anexo.data_validade, anexo.valor, anexo.data_leitura) as _) ORDER BY anexo.sequencia
          )
        ELSE '[]'::json
      END dados_anexos
    FROM mensagem
    LEFT JOIN anexo ON anexo.id_mensagem = mensagem.id
    WHERE mensagem.id_conversa = $1
    GROUP BY mensagem.id_conversa, mensagem.id
    ORDER BY mensagem.data_envio ASC
    LIMIT $2
    OFFSET $3
    `, [ id_conversa, limit, limit * offset ])
  }
}
