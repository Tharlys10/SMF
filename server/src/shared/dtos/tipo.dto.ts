import { IsNotEmpty, IsString, Max } from "class-validator"

export class CreateTipoDto {
  @IsNotEmpty()
  @IsString()
  @Max(50)
  descricao: string

  @IsNotEmpty()
  @IsString()
  @Max(6)
  cor: string
}

export class UpdateTipoDto {
  descricao?: string

  cor?: string
}