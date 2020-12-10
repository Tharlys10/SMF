import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateConversaDto {
  @IsNotEmpty()
  @IsString()
  assunto: string

  id_usuario_primario: string

  @IsNotEmpty()
  @IsUUID()
  id_usuario_secundario: string

  @IsNotEmpty()
  @IsNumber()
  id_categoria: number
}