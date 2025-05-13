
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { DollarSign, ArrowDownCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Devedor {
  aluno_id: number;
  nome: string;
  saldo: number;
  historico: Array<{
    id: number;
    tipo: 'venda' | 'pagamento';
    valor: number;
    data: string;
    descricao: string;
  }>;
}

// Simulated data for demonstration
const devedoresMock: Devedor[] = [
  {
    aluno_id: 1,
    nome: 'Ana Silva',
    saldo: 45.50,
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
    historico: [
      { id: 5, tipo: 'venda', valor: 8.75, data: '2023-05-10 11:45:00', descricao: 'Suco e salgado' },
      { id: 6, tipo: 'venda', valor: 15.00, data: '2023-05-08 09:30:00', descricao: 'Lanche completo' },
    ]
  },
  {
    aluno_id: 3,
    nome: 'Carla Oliveira',
    saldo: 18.00,
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
  const [loading, setLoading] = useState(true);
  const [selectedDevedor, setSelectedDevedor] = useState<Devedor | null>(null);
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [valorPagamento, setValorPagamento] = useState('');
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDevedores(devedoresMock);
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{devedor.nome}</h3>
                      <p className="text-muted-foreground text-sm">{devedor.historico.length} transações</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-amber-600">R$ {devedor.saldo.toFixed(2)}</div>
                      <div className="flex justify-end space-x-2 mt-2">
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
