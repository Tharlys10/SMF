import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../shared/dtos';
import { Categoria } from '../../shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria) private repo: Repository<Categoria>
  ) {}

  async create(categoria: CreateCategoriaDto): Promise<Categoria> {
    return await this.repo.save(this.repo.create(categoria))
  }

  async update(id: number, categoria: UpdateCategoriaDto): Promise<boolean> {
    const updated = await this.repo.update({ id }, categoria)
    return !!updated.affected
  }

  async list(): Promise<Categoria[]> {
    return await this.repo.find()
  }
}
