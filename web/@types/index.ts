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
  texto: string
  anexos: CreateAnxNaMensagem[]
}


export interface UpdateUsuarioDto {
  nome?: string
  email?: string
  contato_nome?: string
  contato_celular?: string
  id_tipo: number
}

export interface CreateAnxNaMensagem {
  instrucao: string
  arquivo: string
  ext: string
  data_validade: Date
  valor: number
}

export interface CreateMensagemEConversaDto {
  anexos: CreateAnxNaMensagem[]
  texto: string
  id_destinatario: string[]
  assunto: string
  id_categoria: number
}

export interface CategoriaDto {
  id: number
  descricao: string
  color: string
}

export interface CreateCategoriaDto {
  descricao: string
  cor: string
}

export interface UpdateCategoriaDto {
  descricao: string
  cor: string
}

export interface TipoDto {
  id: number
  descricao: string
  cor: string
}

export interface CreateTipoDto {
  descricao: string
  cor: string
}

export interface UpdateTipoDto {
  descricao: string
  cor: string
}

export interface AnexosCustom {
  instrucao: string
  data_validade: Date
  valor: number
  arquivo: string
  name_file: string
  ext_file: string
}