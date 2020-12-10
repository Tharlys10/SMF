import { IsNotEmpty, IsString, Max } from "class-validator"

export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  @Max(50)
  descricao: string

  @IsNotEmpty()
  @IsString()
  @Max(6)
  cor: string
}

export class UpdateCategoriaDto {
  descricao?: string

  cor?: string
}