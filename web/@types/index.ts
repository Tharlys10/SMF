export interface LoginDto {
  email: string
  senha: string
}

export interface CreateUsuarioDto {
  nome: string
  email: string
  contato_nome: string
  contato_celular: string
  senha: string
}

export interface CreateMensagemDto {
  id_conversa: string
  id_destinatario: string
  anexo?: string
  ext?: string
  texto: string
  valor: number
}


export interface UpdateUsuarioDto {
  nome?: string
  email?: string
  contato_nome?: string
  contato_celular?: string
}

export interface CreateMensagemEConversaDto {
  anexo?: string
  ext?: string
  texto: string
  valor: number
  id_destinatario: string[]
  assunto: string
}