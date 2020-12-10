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
  id_tipo: number
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
  id_tipo: number
}

export interface CreateMensagemEConversaDto {
  anexo?: string
  ext?: string
  texto: string
  valor: number
  id_destinatario: string[]
  assunto: string
  id_categoria: number
}

export interface CategoriaDto {
  id: number
  nome: string
  color: string
}

export interface TipoDto {
  id: number
  nome: string
  color: string
}