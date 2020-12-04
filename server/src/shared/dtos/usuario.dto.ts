import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  contato_nome: string

  @IsNotEmpty()
  @IsString()
  contato_celular: string

  @IsNotEmpty()
  @IsString()
  senha: string
}

export class UpdateUsuarioDto {
  nome?: string
  email?: string
  contato_nome?: string
  contato_celular?: string
}

export class FilterUsuarios {
  page?: number
  limit?: number
  busca?: string
}