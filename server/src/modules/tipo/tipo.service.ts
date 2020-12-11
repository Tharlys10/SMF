import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTipoDto, UpdateTipoDto } from '../../shared/dtos';
import { Tipo } from '../../shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TipoService {
  constructor(
    @InjectRepository(Tipo) private repo: Repository<Tipo>
  ) {}

  async create(tipo: CreateTipoDto): Promise<Tipo> {
    return await this.repo.save(this.repo.create(tipo))
  }

  async update(id: number, tipo: UpdateTipoDto): Promise<boolean> {
    const updated = await this.repo.update({ id }, tipo)
    return !!updated.affected
  }

  async list(): Promise<Tipo[]> {
    return await this.repo.find({
      order: { descricao: 'ASC' }
    })
  }
}
