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