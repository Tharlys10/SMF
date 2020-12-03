import { compare, hash } from "bcrypt";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'character varying' })
  nome: string

  @Column({ type: 'character varying', length: 150 })
  email: string

  @Column({ type: 'character varying', length: 255 })
  contato_nome: string

  @Column({ type: 'character varying', length: 255 })
  contato_celular: string

  @Column()
  senha: string

  @Column({ type: 'boolean', default: false })
  master: boolean

  @CreateDateColumn()
  criado_em: Date

  @UpdateDateColumn({ nullable: true })
  atualizado_em: Date

  @BeforeInsert()
  async hashSenha(): Promise<void> {
    this.senha = await hash(this.senha, 10)
  }

  async compareSenha(given: string): Promise<boolean> {
    return await compare(given, this.senha);
  }
}