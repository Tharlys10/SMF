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

  async create(mensagem: CreateMensagemDto): Promise<Mensagem> {
    const anexoBuffer = mensagem.anexo ? Buffer.from(mensagem.anexo.split(',')[1], 'base64') : null

    return await this.repo.save(this.repo.create({
      ...mensagem,
      anexo: anexoBuffer
    }))
  }

  async listByConversa(id_conversa: string, pagination: Pagination): Promise<Mensagem[]> {
    if (!pagination) {
      pagination = { page: 0, limit: 50 }
    }

    const offset = pagination.page ? pagination.page < 0 ? 0 : pagination.page - 1 : 0
    const limit = pagination.limit ? pagination.limit < 0 ? 10 : pagination.limit : 10

    const caseAnexoSelect = `
      CASE
        WHEN mensagem.anexo IS NOT NULL THEN true
        ELSE false
      END AS anexo
    `

    return await this.repo.createQueryBuilder()
      .select([
        'mensagem.id id',
        'mensagem.id_conversa id_conversa',
        'mensagem.id_remetente id_remetente',
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
