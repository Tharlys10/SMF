import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity()
export class Conversa {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'character varying', length: 250 })
  assunto: string

  @Column({ type: 'uuid' })
  id_usuario_primario: string

  @Column({ type: 'uuid' })
  id_usuario_secundario: string

  @CreateDateColumn()
  data_inicio: Date
}