import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, {
    message: 'E-mail não possui um formato válido'
  })
  email: string

  @IsNotEmpty()
  @IsString({
    message: 'Senha precisa ter caracteres'
  })
  @Length(8, 64, {
    message: 'Senha deve ter no mínimo 8 caracteres'
  })
  senha: string
}

export class UpdateSenhaDto {
  id: string
  senha_antiga: string
  senha_nova: string
}