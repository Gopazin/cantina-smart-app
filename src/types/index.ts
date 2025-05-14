
export interface Aluno {
  id: number;
  nome: string;
  turma: string;
  responsavel_id?: number;
}

export interface Responsavel {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  alunos?: Aluno[];
}

export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
}

export interface Venda {
  id: number;
  aluno_id: number;
  aluno_nome: string;
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  total: number;
  forma_pagamento: string;
  data: string;
}

export interface Devedor {
  aluno_id: number;
  nome: string;
  saldo: number;
  responsavel_id?: number;
  responsavel_nome?: string;
  responsavel_email?: string;
  responsavel_telefone?: string;
  historico: Array<{
    id: number;
    tipo: 'venda' | 'pagamento';
    valor: number;
    data: string;
    descricao: string;
  }>;
}

export interface NotificacaoConfig {
  ativa: boolean;
  metodos: {
    email: boolean;
    whatsapp: boolean;
  };
  frequencia: 'imediato' | 'diario' | 'semanal';
  conteudo: {
    incluirDetalhesCompra: boolean;
    incluirSaldoTotal: boolean;
    assunto: string;
    mensagem: string;
  };
}
