
import { Aluno, Devedor, Responsavel, Venda } from "@/types";

interface NotificacaoParams {
  responsavel: Responsavel;
  aluno: Aluno;
  venda?: Venda;
  saldoTotal: number;
  enviarPor?: ('email' | 'whatsapp')[];
}

interface NotificacaoResult {
  success: boolean;
  method: string;
  to: string;
  message: string;
  error?: string;
}

// Função para formatar valor monetário
export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

// Função para formatar data
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
};

// Carregar configurações de notificação do localStorage
export const getNotificacaoConfig = () => {
  const defaultConfig = {
    ativa: true,
    metodos: {
      email: true,
      whatsapp: false
    },
    frequencia: 'imediato',
    conteudo: {
      incluirDetalhesCompra: true,
      incluirSaldoTotal: true,
      assunto: 'Notificação de consumo na cantina',
      mensagem: 'Olá {responsavel}, informamos que {aluno} realizou um consumo na cantina da escola. {detalhes_compra} {saldo_total}'
    }
  };

  const savedConfig = localStorage.getItem('notificacaoConfig');
  return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
};

// Preparar detalhes da compra
const prepararDetalhesCompra = (venda?: Venda): string => {
  if (!venda) return '';

  return `
Produto: ${venda.produto_nome}
Quantidade: ${venda.quantidade}
Valor total: ${formatCurrency(venda.total)}
Data: ${formatDate(venda.data)}
`;
};

// Preparar texto sobre saldo total
const prepararSaldoTotal = (saldoTotal: number): string => {
  return `O saldo devedor atual é de ${formatCurrency(saldoTotal)}.`;
};

// Substituir variáveis no template
const substituirVariaveis = (template: string, params: NotificacaoParams): string => {
  const config = getNotificacaoConfig();
  let mensagem = template
    .replace('{responsavel}', params.responsavel.nome)
    .replace('{aluno}', params.aluno.nome);
    
  if (config.conteudo.incluirDetalhesCompra && params.venda) {
    mensagem = mensagem.replace('{detalhes_compra}', prepararDetalhesCompra(params.venda));
  } else {
    mensagem = mensagem.replace('{detalhes_compra}', '');
  }
  
  if (config.conteudo.incluirSaldoTotal) {
    mensagem = mensagem.replace('{saldo_total}', prepararSaldoTotal(params.saldoTotal));
  } else {
    mensagem = mensagem.replace('{saldo_total}', '');
  }
  
  return mensagem;
};

// Simular envio de e-mail (apenas log no console)
const simularEnvioEmail = (to: string, subject: string, message: string): NotificacaoResult => {
  console.log(`[SIMULAÇÃO DE EMAIL] Para: ${to}, Assunto: ${subject}`);
  console.log(`[SIMULAÇÃO DE EMAIL] Mensagem: ${message}`);
  
  // Em uma implementação real, aqui seria a chamada para o serviço de e-mail
  return {
    success: true,
    method: 'email',
    to,
    message
  };
};

// Simular envio de WhatsApp (apenas log no console)
const simularEnvioWhatsApp = (to: string, message: string): NotificacaoResult => {
  console.log(`[SIMULAÇÃO DE WHATSAPP] Para: ${to}`);
  console.log(`[SIMULAÇÃO DE WHATSAPP] Mensagem: ${message}`);
  
  // Em uma implementação real, aqui seria a chamada para a API do WhatsApp
  return {
    success: true,
    method: 'whatsapp',
    to,
    message
  };
};

// Função principal para enviar notificações
export const enviarNotificacao = async (params: NotificacaoParams): Promise<NotificacaoResult[]> => {
  const config = getNotificacaoConfig();
  
  // Verificar se as notificações estão ativas
  if (!config.ativa) {
    console.log('Notificações desativadas nas configurações.');
    return [{ 
      success: false, 
      method: 'none', 
      to: '', 
      message: 'Notificações desativadas',
      error: 'Notificações desativadas nas configurações.' 
    }];
  }
  
  // Preparar mensagem com base nas configurações
  const mensagem = substituirVariaveis(config.conteudo.mensagem, params);
  const assunto = config.conteudo.assunto
    .replace('{aluno}', params.aluno.nome)
    .replace('{valor}', params.venda ? formatCurrency(params.venda.total) : '');
  
  const resultados: NotificacaoResult[] = [];
  
  // Determinar métodos de envio
  const metodos = params.enviarPor || 
    Object.entries(config.metodos)
      .filter(([_, ativo]) => ativo)
      .map(([metodo]) => metodo as 'email' | 'whatsapp');
  
  // Enviar por cada método ativo
  for (const metodo of metodos) {
    if (metodo === 'email' && params.responsavel.email) {
      resultados.push(simularEnvioEmail(params.responsavel.email, assunto, mensagem));
    }
    
    if (metodo === 'whatsapp' && params.responsavel.telefone) {
      resultados.push(simularEnvioWhatsApp(params.responsavel.telefone, mensagem));
    }
  }
  
  return resultados;
};

// Função para notificar sobre uma venda fiado
export const notificarVendaFiado = async (
  responsavel: Responsavel,
  aluno: Aluno,
  venda: Venda,
  saldoTotal: number
): Promise<NotificacaoResult[]> => {
  return enviarNotificacao({
    responsavel,
    aluno,
    venda,
    saldoTotal
  });
};

// Função para notificar sobre saldo devedor
export const notificarSaldoDevedor = async (
  responsavel: Responsavel,
  aluno: Aluno,
  saldoTotal: number
): Promise<NotificacaoResult[]> => {
  return enviarNotificacao({
    responsavel,
    aluno,
    saldoTotal
  });
};
