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
    // const anexoBuffer = mensagem.anexo ? Buffer.from(mensagem.anexo.split(',')[1], 'base64') : null

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
      .where('mensagem.id = :id', { id })
      .getRawOne()
  }

  // async visualizeAnexoByMensagem(id: string): Promise<Mensagem> {
  //   const mensagem = await this.index(id)

  //   if (!mensagem.data_anexo) {
  //     await this.repo.createQueryBuilder()
  //       .update(Mensagem)
  //       .set({ data_anexo: new Date() })
  //       .where('id = :id', { id })
  //       .execute()
  //   }

  //   return mensagem
  // }

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
    return await this.repo.findOne({ id })
  }

  // async indexWithAnexo(id: string): Promise<{ id: string, anexo: string, ext: string }> {
  //   const { id: idm, anexo, ext } = await this.repo.findOne({
  //     select: ['id', 'anexo', 'ext'],
  //     where: { id }
  //   })

  //   return { id: idm, anexo: anexo.toString('base64'), ext }
  // }

  // async viewAnexo(id: string, id_usuario: string): Promise<boolean> {
  //   const updated = await this.repo.createQueryBuilder()
  //     .update(Mensagem)
  //     .set({ data_anexo: new Date() })
  //     .where('id = :id', { id })
  //     .andWhere('id_remetente <> :id_remetente', { id_remetente: id_usuario })
  //     .andWhere('data_anexo IS NULL')
  //     .execute()

  //   return !!updated.affected
  // }

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

    const caseAnexoSelect = `
      (SELECT COUNT(*) FROM anexo WHERE anexo.id_mensagem = mensagem.id)::integer anexos
    `
    const caseRemetenteSelect = `
      CASE
        WHEN mensagem.id_remetente = '${id_usuario}' THEN true
        ELSE false
      END AS e_remetente
    `

    const a = await this.repo.createQueryBuilder()
      .distinct()
      .select([
        'mensagem.id id',
        'mensagem.id_conversa id_conversa',
        'mensagem.id_remetente id_remetente',
        caseRemetenteSelect,
        caseAnexoSelect,
        'mensagem.texto texto',
        'mensagem.data_leitura data_leitura',
        'mensagem.data_envio data_envio',
        'array_agg((anexo.sequencia, anexo.instrucao)) anexos'
      ])
      .from(Mensagem, 'mensagem')
      .leftJoin(Anexo, 'anexo', 'anexo.id_mensagem = mensagem.id')
      .where('mensagem.id_conversa = :id_conversa', { id_conversa })
      .orderBy('mensagem.data_envio', 'ASC')
      .groupBy('mensagem.id_conversa, mensagem.id')
      .limit(limit)
      .offset(limit * offset)
      .getRawMany()

    console.log(a);
    return a
  }
}
