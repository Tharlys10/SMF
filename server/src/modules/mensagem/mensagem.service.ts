import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/shared/@types';
import { CreateMensagemDto } from 'src/shared/dtos';
import { Mensagem } from 'src/shared/entities/mensagem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MensagemService {
  constructor(
    @InjectRepository(Mensagem) private repo: Repository<Mensagem>
  ) {}

  async create(mensagem: CreateMensagemDto): Promise<any> {
    const anexoBuffer = mensagem.anexo ? Buffer.from(mensagem.anexo.split(',')[1], 'base64') : null

    const { id, id_remetente } = await this.repo.save(this.repo.create({
      ...mensagem,
      anexo: anexoBuffer
    }))

    const caseAnexoSelect = `
      CASE
        WHEN mensagem.anexo IS NOT NULL THEN true
        ELSE false
      END AS tem_anexo
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
        'mensagem.valor valor',
        'mensagem.data_anexo data_anexo',
        'mensagem.data_leitura data_leitura',
        'mensagem.data_envio data_envio'
      ])
      .from(Mensagem, 'mensagem')
      .where('mensagem.id = :id', { id })
      .getRawOne()
  }

  async visualizeAnexoByMensagem(id: string): Promise<Mensagem> {
    const mensagem = await this.index(id)

    if (!mensagem.data_anexo) {
      await this.repo.createQueryBuilder()
        .update(Mensagem)
        .set({ data_anexo: new Date() })
        .where('id = :id', { id })
        .execute()
    }

    return mensagem
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
    return await this.repo.findOne({ id })
  }

  async indexWithAnexo(id: string, id_usuario: string): Promise<{ id: string, anexo: string, ext: string, atualizado: boolean }> {
    const { id: idm, anexo, ext } = await this.repo.findOne({
      select: ['id', 'anexo', 'ext'],
      where: { id }
    })

    const updated = await this.repo.createQueryBuilder()
      .update(Mensagem)
      .set({ data_anexo: new Date() })
      .where('id_remetente = :id', { id: id_usuario })
      .andWhere('id <> :id', { id: idm })
      .andWhere('data_anexo IS NULL')
      .execute()

    console.log(updated.affected);
    // verificar porque quando o usuário que envia a mensagem baixa e consegue marcar o anexo como visto


    return { id: idm, anexo: anexo.toString('base64'), ext, atualizado: !!updated.affected }
  }

  async view(id_usuario: string, id_conversa: string): Promise<boolean> {
    const updated = await this.repo.createQueryBuilder()
      .update(Mensagem)
      .set({ data_leitura: new Date() })
      .where('id_remetente <> :id', { id: id_usuario })
      .andWhere('id_conversa = :id_conversa', { id_conversa })
      .andWhere('data_leitura IS NULL')
      .execute()

    return !!updated.affected
  }

  async listByConversa(id_usuario: string, id_conversa: string, pagination: Pagination): Promise<Mensagem[]> {
    if (!pagination) {
      pagination = { page: 0, limit: 50 }
    }

    const offset = pagination.page ? pagination.page < 0 ? 0 : pagination.page - 1 : 0
    const limit = pagination.limit ? pagination.limit < 0 ? 50 : pagination.limit : 50

    const caseAnexoSelect = `
      CASE
        WHEN mensagem.anexo IS NOT NULL THEN true
        ELSE false
      END AS tem_anexo
    `
    const caseRemetenteSelect = `
      CASE
        WHEN mensagem.id_remetente = '${id_usuario}' THEN true
        ELSE false
      END AS e_remetente
    `

    return await this.repo.createQueryBuilder()
      .distinct()
      .select([
        'mensagem.id id',
        'mensagem.id_conversa id_conversa',
        'mensagem.id_remetente id_remetente',
        caseRemetenteSelect,
        caseAnexoSelect,
        'mensagem.texto texto',
        'mensagem.valor valor',
        'mensagem.data_anexo data_anexo',
        'mensagem.data_leitura data_leitura',
        'mensagem.data_envio data_envio'
      ])
      .from(Mensagem, 'mensagem')
      .where('mensagem.id_conversa = :id_conversa', { id_conversa })
      .orderBy('mensagem.data_envio', 'ASC')
      .limit(limit)
      .offset(limit * offset)
      .getRawMany()
  }
}
