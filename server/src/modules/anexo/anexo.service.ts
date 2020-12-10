import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnexoDto } from 'src/shared/dtos';
import { Anexo } from 'src/shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AnexoService {
  constructor(
    @InjectRepository(Anexo) private repo: Repository<Anexo>
  ) {}

  async create(anexo: CreateAnexoDto): Promise<boolean> {
    const anexoBuffer = anexo.arquivo ? Buffer.from(anexo.arquivo.split(',')[1], 'base64') : null

    const created = await this.repo.save(this.repo.create({
      ...anexo,
      arquivo: anexoBuffer
    }))

    return !!created
  }

  async createMany(anexos: CreateAnexoDto[]): Promise<boolean> {
    const anx = anexos.map(anexo => ({
      ...anexo,
      arquivo: anexo.arquivo ? Buffer.from(anexo.arquivo.split(',')[1], 'base64') : null
    }))

    const created = await this.repo.createQueryBuilder()
      .insert()
      .into(Anexo)
      .values(anx)
      .execute()

    return !!created.raw
  }

  async visualize(id_mensagem: string, sequencia: number, id_usuario: string): Promise<boolean> {
    const mensagem = await this.repo.query(`
      SELECT CASE (id_remetente <> $1) THEN true ELSE false FROM mensagem WHERE id = $2
    `, [ id_usuario, id_mensagem ])

    if (mensagem) {
      const updated = await this.repo.createQueryBuilder()
        .update(Anexo)
        .set({ data_leitura: new Date() })
        .where('id_mensagem = :id_mensagem', { id_mensagem })
        .andWhere('sequencia = :sequencia', { sequencia })
        .andWhere('data_leitura IS NULL')
        .execute()

      return !!updated.affected
    }

    return false
  }

  async index(id_mensagem: string, sequencia: number): Promise<Anexo> {
    return await this.repo.findOne({
      where: { id_mensagem, sequencia }
    })
  }

  async listByMensagem(id_mensagem: string): Promise<Anexo[]> {
    return await this.repo.find({
      where: { id_mensagem }
    })
  }
}
