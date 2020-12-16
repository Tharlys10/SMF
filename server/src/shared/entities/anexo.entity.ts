import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ schema: 'public' })
export class Anexo {
  @PrimaryColumn({ type: 'uuid', name: 'id_mensagem' })
  id_mensagem: string

  @PrimaryColumn({ type: 'smallint' })
  sequencia: number

  @Column({ type: 'character varying', length: 255 })
  instrucao: string

  @Column({ type: 'bytea' })
  arquivo: Buffer

  @Column({ type: 'character varying', length: 10 })
  ext: string

  @Column({ type: 'double precision', default: 0 })
  valor: number

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_validade?: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_leitura?: Date
}