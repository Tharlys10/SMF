import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConversaDto } from 'src/shared/dtos/conversa.dto';
import { Usuario } from 'src/shared/entities';
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

  async listByUsuario(id_usuario: string): Promise<any[]> {
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
        '(SELECT data_envio FROM mensagem m WHERE m.id_conversa = conversa.id ORDER BY m.data_envio DESC LIMIT 1) data_ultima_mensagem',
        `(SELECT count(*) FROM mensagem m WHERE m.id_conversa = conversa.id AND m.id_remetente <> '${id_usuario}' AND data_leitura IS NULL)::integer total_nao_lidas`
      ])
      .leftJoin(Usuario, 'usuario_p', 'usuario_p.id = conversa.id_usuario_primario')
      .leftJoin(Usuario, 'usuario_s', 'usuario_s.id = conversa.id_usuario_secundario')
      .where('conversa.id_usuario_primario = :usuario', { usuario: id_usuario })
      .orWhere('conversa.id_usuario_secundario = :usuario', { usuario: id_usuario })
      .orderBy('data_ultima_mensagem', 'DESC')
      .getRawMany()
  }
}
