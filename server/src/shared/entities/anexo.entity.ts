import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Anexo {
  @PrimaryColumn({ type: 'uuid', name: 'id_mensagem' })
  id_mensagem: string

  @PrimaryColumn({ type: 'smallint' })
  sequencia: number

  @Column({ type: 'character varying', length: 255 })
  instrucao: string

  @Column({ type: 'bytea', nullable: true })
  arquivo: Buffer

  @Column({ type: 'character varying', length: 10, nullable: true })
  ext: string

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_validade?: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  data_leitura?: Date
}