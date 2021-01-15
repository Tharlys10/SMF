import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateCategoriaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  descricao: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  cor: string
}

export class UpdateCategoriaDto {
  descricao?: string

  cor?: string
}