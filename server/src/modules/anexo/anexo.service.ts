import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LOADIPHLPAPI } from 'dns';
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
    const [{ coalesce }] = await this.repo
      .query(`SELECT COALESCE(MAX(sequencia)+1, 0)::integer FROM anexo WHERE id_mensagem = '${anexos[0].id_mensagem}'`)

    const anx = anexos.map((anexo, i) => ({
      ...anexo,
      sequencia: coalesce + i + 1,
      arquivo: anexo.arquivo ? Buffer.from(anexo.arquivo.split(',')[1], 'base64') : null,
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
      SELECT CASE WHEN (id_remetente <> $1) THEN true ELSE false END FROM mensagem WHERE id = $2
    `, [ id_usuario, id_mensagem ])

    if (mensagem[0].case) {
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

  async indexWithArquivo(id_mensagem: string, sequencia: number): Promise<{ arquivo: string, ext: string, data_leitura: Date }> {
    const { arquivo, ext, data_leitura } = await this.repo.findOne({
      select: ['arquivo', 'ext', 'data_leitura'],
      where: { id_mensagem, sequencia }
    })

    return {
      arquivo: arquivo ? arquivo.toString('base64') : null,
      ext,
      data_leitura
    }
  }

  async listByMensagem(id_mensagem: string): Promise<Anexo[]> {
    return await this.repo.find({
      where: { id_mensagem }
    })
  }
}
