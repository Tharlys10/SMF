import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateMensagemDto {
  @IsNotEmpty()
  @IsUUID()
  id_conversa: string

  // não é passado, pois é pegado pelo decorator
  id_remetente?: string

  anexo?: string

  @IsNotEmpty()
  @IsString()
  texto: string

  @IsNotEmpty()
  @IsNumber()
  valor: number
}

export class CreateMensagemEConversaDto {
  // não é passado, pois é pegado pelo decorator
  id_remetente?: string

  anexo?: string

  ext?: string

  @IsNotEmpty()
  @IsString()
  texto: string

  @IsNotEmpty()
  @IsNumber()
  valor: number

  // campos relacionados a conversa
  @IsNotEmpty()
  @IsArray()
  id_destinatario: string[]

  @IsNotEmpty()
  @IsString()
  assunto: string
}