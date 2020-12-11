import { IsNotEmpty, IsNumber, IsString, IsUUID, Max } from "class-validator"

export class CreateAnexoDto {
  @IsNotEmpty()
  @IsUUID()
  id_mensagem: string

  sequencia?: number

  @IsNotEmpty()
  @IsString()
  instrucao: string

  @IsNotEmpty()
  @IsString()
  arquivo: string

  @IsNotEmpty()
  @IsString()
  @Max(10)
  ext: string

  data_validade?: Date

  @IsNumber()
  valor: number
}