import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConversaDto } from 'src/shared/dtos/conversa.dto';
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
      where: [
        { id_usuario_primario, id_usuario_secundario },
        { id_usuario_primario: id_usuario_secundario, id_usuario_secundario: id_usuario_primario },
      ]
    })
  }

  async listByUsuario(id_usuario: string): Promise<Conversa[]> {
    return await this.repo.find({
      where: [
        { id_usuario_primario: id_usuario },
        { id_usuario_secundario: id_usuario },
      ]
    })
  }
}
