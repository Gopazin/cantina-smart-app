
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { DollarSign, ArrowDownCircle, TrendingUp, Mail, PhoneCall, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Aluno, Devedor, Responsavel } from '@/types';
import { enviarNotificacao } from '@/services/notification';

// Simulated data for demonstration
const alunosMock: Aluno[] = [
  { id: 1, nome: 'Ana Silva', turma: '5º Ano A', responsavel_id: 1 },
  { id: 2, nome: 'Bruno Santos', turma: '3º Ano B', responsavel_id: 2 },
  { id: 3, nome: 'Carla Oliveira', turma: '7º Ano A', responsavel_id: 3 },
];

const responsaveisMock: Responsavel[] = [
  { id: 1, nome: 'Maria Silva', email: 'maria.silva@email.com', telefone: '(11) 99999-1111' },
  { id: 2, nome: 'João Santos', email: 'joao.santos@email.com', telefone: '(11) 99999-2222' },
  { id: 3, nome: 'Paula Oliveira', email: 'paula.oliveira@email.com', telefone: '(11) 99999-3333' },
];

const devedoresMock: Devedor[] = [
  {
    aluno_id: 1,
    nome: 'Ana Silva',
    saldo: 45.50,
    responsavel_id: 1,
    historico: [
      { id: 1, tipo: 'venda', valor: 11.00, data: '2023-05-10 08:30:00', descricao: 'Coxinha (2x)' },
      { id: 2, tipo: 'venda', valor: 5.00, data: '2023-05-09 09:15:00', descricao: 'Refrigerante' },
      { id: 3, tipo: 'venda', valor: 39.50, data: '2023-05-08 10:00:00', descricao: 'Diversos itens' },
      { id: 4, tipo: 'pagamento', valor: 10.00, data: '2023-05-07 15:30:00', descricao: 'Pagamento parcial' },
    ]
  },
  {
    aluno_id: 2,
    nome: 'Bruno Santos',
    saldo: 23.75,
    responsavel_id: 2,
    historico: [
      { id: 5, tipo: 'venda', valor: 8.75, data: '2023-05-10 11:45:00', descricao: 'Suco e salgado' },
      { id: 6, tipo: 'venda', valor: 15.00, data: '2023-05-08 09:30:00', descricao: 'Lanche completo' },
    ]
  },
  {
    aluno_id: 3,
    nome: 'Carla Oliveira',
    saldo: 18.00,
    responsavel_id: 3,
    historico: [
      { id: 7, tipo: 'venda', valor: 6.00, data: '2023-05-11 09:10:00', descricao: 'Bolo' },
      { id: 8, tipo: 'venda', valor: 12.00, data: '2023-05-09 10:20:00', descricao: 'Sanduíche' },
      { id: 9, tipo: 'pagamento', valor: 15.00, data: '2023-05-07 14:00:00', descricao: 'Pagamento parcial' },
      { id: 10, tipo: 'venda', valor: 15.00, data: '2023-05-06 08:45:00', descricao: 'Itens diversos' },
    ]
  },
];

const Fiado: React.FC = () => {
  const [devedores, setDevedores] = useState<Devedor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevedor, setSelectedDevedor] = useState<Devedor | null>(null);
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [valorPagamento, setValorPagamento] = useState('');
  const [notificando, setNotificando] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlunos(alunosMock);
      setResponsaveis(responsaveisMock);
      
      // Enriquecer os devedores com informações do responsável
      const devedoresCompletos = devedoresMock.map(devedor => {
        const responsavelId = devedor.responsavel_id || 
          alunos.find(a => a.id === devedor.aluno_id)?.responsavel_id;
          
        if (responsavelId) {
          const responsavel = responsaveisMock.find(r => r.id === responsavelId);
          if (responsavel) {
            return {
              ...devedor,
              responsavel_id: responsavel.id,
              responsavel_nome: responsavel.nome,
              responsavel_email: responsavel.email,
              responsavel_telefone: responsavel.telefone
            };
          }
        }
        return devedor;
      });
      
      setDevedores(devedoresCompletos);
      setLoading(false);
    }, 500);
  }, []);

  const handleRegistrarPagamento = (alunoId: number) => {
    const devedor = devedores.find(d => d.aluno_id === alunoId);
    if (!devedor) return;
    
    if (!valorPagamento || isNaN(parseFloat(valorPagamento)) || parseFloat(valorPagamento) <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Digite um valor válido para o pagamento.",
      });
      return;
    }

    const valor = parseFloat(valorPagamento);
    if (valor > devedor.saldo) {
      toast({
        variant: "destructive",
        title: "Valor excede o saldo",
        description: "O valor de pagamento não pode ser maior que o saldo em fiado.",
      });
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 19).replace('T', ' ');
    
    // Update the devedor
    const updatedDevedores = devedores.map(d => {
      if (d.aluno_id === alunoId) {
        // Add new history item
        const novoHistorico = [
          {
            id: Math.max(...d.historico.map(h => h.id)) + 1,
            tipo: 'pagamento' as 'pagamento',
            valor,
            data: formattedDate,
            descricao: 'Pagamento recebido',
          },
          ...d.historico
        ];
        
        return {
          ...d,
          saldo: Number((d.saldo - valor).toFixed(2)),
          historico: novoHistorico,
        };
      }
      return d;
    });
    
    setDevedores(updatedDevedores);
    setValorPagamento('');
    setPagamentoAberto(false);
    
    toast({
      title: "Pagamento registrado",
      description: `Pagamento de R$ ${valor.toFixed(2)} registrado para ${devedor.nome}.`,
    });
  };

  const handleEnviarNotificacao = async (devedorId: number) => {
    const devedor = devedores.find(d => d.aluno_id === devedorId);
    if (!devedor || !devedor.responsavel_id) return;
    
    const aluno = alunos.find(a => a.id === devedor.aluno_id);
    const responsavel = responsaveis.find(r => r.id === devedor.responsavel_id);
    
    if (!aluno || !responsavel) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Não foi possível encontrar as informações do aluno ou responsável.",
      });
      return;
    }
    
    setNotificando(devedorId);
    
    try {
      const result = await enviarNotificacao({
        responsavel,
        aluno,
        saldoTotal: devedor.saldo
      });
      
      if (result.some(r => r.success)) {
        toast({
          title: "Notificação enviada",
          description: `${responsavel.nome} foi notificado sobre o saldo devedor de ${aluno.nome}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao enviar notificação",
          description: "Não foi possível enviar a notificação. Verifique as configurações.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description: "Ocorreu um erro ao tentar enviar a notificação.",
      });
    } finally {
      setNotificando(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Fiado</h1>
          <p className="text-muted-foreground">Acompanhe saldos em fiado e registre pagamentos</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Saldos em Fiado</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp size={16} />
              <span>Total: R$ {devedores.reduce((sum, d) => sum + d.saldo, 0).toFixed(2)}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : devedores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum saldo em fiado registrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {devedores.map(devedor => (
                <div 
                  key={devedor.aluno_id} 
                  className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{devedor.nome}</h3>
                      
                      {/* Informações do responsável */}
                      {devedor.responsavel_nome ? (
                        <div className="mt-1 mb-2">
                          <p className="text-sm text-muted-foreground">
                            Responsável: {devedor.responsavel_nome}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {devedor.responsavel_email && (
                              <a 
                                href={`mailto:${devedor.responsavel_email}`} 
                                className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                                title={devedor.responsavel_email}
                              >
                                <Mail size={12} className="mr-1" />
                                {devedor.responsavel_email.length > 20 ? 
                                  `${devedor.responsavel_email.substring(0, 20)}...` : 
                                  devedor.responsavel_email}
                              </a>
                            )}
                            {devedor.responsavel_telefone && (
                              <a 
                                href={`tel:${devedor.responsavel_telefone}`}
                                className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <PhoneCall size={12} className="mr-1" />
                                {devedor.responsavel_telefone}
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-amber-500 mt-1">
                          Nenhum responsável vinculado
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">{devedor.historico.length} transações</p>
                    </div>
                    <div className="md:text-right mt-3 md:mt-0">
                      <div className="font-bold text-lg text-amber-600">R$ {devedor.saldo.toFixed(2)}</div>
                      <div className="flex md:justify-end space-x-2 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="flex items-center text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 transition-colors"
                              onClick={() => setSelectedDevedor(devedor)}
                            >
                              <TrendingUp size={14} className="mr-1" />
                              Histórico
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Histórico de {selectedDevedor?.nome}</DialogTitle>
                              <DialogDescription>
                                Detalhes do histórico de fiado e pagamentos
                              </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-80 overflow-y-auto mt-4">
                              {selectedDevedor?.historico.map(item => (
                                <div key={item.id} className="mb-4 border-b pb-2">
                                  <div className="flex justify-between items-center">
                                    <span className={`font-medium ${
                                      item.tipo === 'venda' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {item.tipo === 'venda' ? '- ' : '+ '}
                                      R$ {item.valor.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(item.data).toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                  <p className="text-sm">{item.descricao}</p>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {/* Botão para enviar notificação */}
                        {devedor.responsavel_nome && (
                          <button
                            className="flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            onClick={() => handleEnviarNotificacao(devedor.aluno_id)}
                            disabled={notificando === devedor.aluno_id}
                          >
                            {notificando === devedor.aluno_id ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-700 mr-1"></div>
                                Enviando...
                              </span>
                            ) : (
                              <>
                                <Mail size={14} className="mr-1" />
                                Notificar
                              </>
                            )}
                          </button>
                        )}
                        
                        <Dialog open={pagamentoAberto && selectedDevedor?.aluno_id === devedor.aluno_id} onOpenChange={(open) => {
                          setPagamentoAberto(open);
                          if (open) setSelectedDevedor(devedor);
                          else setValorPagamento('');
                        }}>
                          <DialogTrigger asChild>
                            <button
                              className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                            >
                              <ArrowDownCircle size={14} className="mr-1" />
                              Registrar Pagamento
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Registrar Pagamento</DialogTitle>
                              <DialogDescription>
                                Registrar pagamento para {selectedDevedor?.nome}.
                                Saldo atual: R$ {selectedDevedor?.saldo.toFixed(2)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label htmlFor="valorPagamento" className="block text-sm font-medium text-gray-700 mb-1">
                                  Valor do Pagamento (R$)
                                </label>
                                <input
                                  type="number"
                                  id="valorPagamento"
                                  className="form-input"
                                  placeholder="0,00"
                                  step="0.01"
                                  min="0.01"
                                  max={selectedDevedor?.saldo}
                                  value={valorPagamento}
                                  onChange={e => setValorPagamento(e.target.value)}
                                />
                              </div>
                              <button
                                onClick={() => selectedDevedor && handleRegistrarPagamento(selectedDevedor.aluno_id)}
                                className="w-full btn-primary flex items-center justify-center"
                              >
                                <DollarSign size={16} className="mr-1" />
                                Confirmar Pagamento
                              </button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Fiado;
