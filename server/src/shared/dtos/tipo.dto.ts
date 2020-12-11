import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateTipoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  descricao: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  cor: string
}

export class UpdateTipoDto {
  descricao?: string

  cor?: string
}