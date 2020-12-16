import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'public' })
export class Tipo {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'character varying', length: 50 })
  descricao: string

  @Column({ type: 'character varying', length: 8 })
  cor: string
}