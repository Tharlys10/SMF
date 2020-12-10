import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mensagem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @PrimaryColumn({ type: 'uuid', name: 'id_conversa' })
  id_conversa: string

  @Column({ type: 'uuid', name: 'id_remetente' })
  id_remetente: string

  // @Column({ type: 'bytea', nullable: true })
  // anexo?: Buffer

  // @Column({ type: 'character varying', length: 10, nullable: true })
  // ext?: string

  @Column({ type: 'text' })
  texto: string

  @Column({ type: 'double precision', default: 0 })
  valor: number

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_leitura?: Date

  @CreateDateColumn()
  data_envio: Date
}