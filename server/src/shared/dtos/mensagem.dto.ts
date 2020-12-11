import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateMensagemDto {
  @IsNotEmpty()
  @IsUUID()
  id_conversa: string

  // não é passado, pois é pegado pelo decorator
  id_remetente?: string

  @IsNotEmpty()
  @IsString()
  texto: string

  anexos?: CreateAnxNaMensagem[]
}

interface CreateAnxNaMensagem {
  instrucao: string
  arquivo: string
  ext: string
  data_validade?: Date
  valor: number
}

export class CreateMensagemEConversaDto {
  // não é passado, pois é pegado pelo decorator
  id_remetente?: string

  anexos?: CreateAnxNaMensagem[]

  @IsNotEmpty()
  @IsString()
  texto: string

  // @IsNotEmpty()
  // valor: number

  // campos relacionados a conversa
  @IsNotEmpty()
  @IsArray()
  id_destinatario: string[]

  @IsNotEmpty()
  @IsString()
  assunto: string

  @IsNotEmpty()
  @IsNumber()
  id_categoria: number
}