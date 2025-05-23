
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { DollarSign, CreditCard, ShoppingCart, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Aluno, Responsavel, Produto, Venda, Devedor } from '@/types';
import { notificarVendaFiado } from '@/services/notification';

// Simulated data for demonstration
const alunosMock: Aluno[] = [
  { id: 1, nome: 'Ana Silva', turma: '5º Ano A', responsavel_id: 1 },
  { id: 2, nome: 'Bruno Santos', turma: '3º Ano B', responsavel_id: 2 },
  { id: 3, nome: 'Carla Oliveira', turma: '7º Ano A', responsavel_id: 3 },
];

const produtosMock: Produto[] = [
  { id: 1, nome: 'Coxinha', categoria: 'salgados', preco: 5.50 },
  { id: 2, nome: 'Chocolate', categoria: 'doces', preco: 3.00 },
  { id: 3, nome: 'Refrigerante Lata', categoria: 'bebidas', preco: 5.00 },
];

const vendasMock: Venda[] = [
  { id: 1, aluno_id: 1, aluno_nome: 'Ana Silva', produto_id: 1, produto_nome: 'Coxinha', 
    quantidade: 2, total: 11.00, forma_pagamento: 'dinheiro', data: '2023-05-10 08:30:00' },
  { id: 2, aluno_id: 2, aluno_nome: 'Bruno Santos', produto_id: 3, produto_nome: 'Refrigerante Lata', 
    quantidade: 1, total: 5.00, forma_pagamento: 'pix', data: '2023-05-10 09:15:00' },
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
];

const Vendas: React.FC = () => {
  const [alunoId, setAlunoId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [devedores, setDevedores] = useState<Devedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [totalVenda, setTotalVenda] = useState(0);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setAlunos(alunosMock);
      setProdutos(produtosMock);
      setVendas(vendasMock);
      setResponsaveis(responsaveisMock);
      setDevedores(devedoresMock);
      setLoading(false);
    }, 500);
  }, []);

  // Update selected product and total when product ID or quantity changes
  useEffect(() => {
    const product = produtos.find(p => p.id === parseInt(produtoId));
    setSelectedProduct(product || null);
    
    if (product) {
      setTotalVenda(product.preco * quantidade);
    } else {
      setTotalVenda(0);
    }
  }, [produtoId, quantidade, produtos]);

  const handleRegistrarVenda = async () => {
    if (!alunoId || !produtoId || quantidade < 1) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Selecione um aluno, um produto e a quantidade.",
      });
      return;
    }

    const aluno = alunos.find(a => a.id === parseInt(alunoId));
    const produto = produtos.find(p => p.id === parseInt(produtoId));
    
    if (!aluno || !produto) {
      toast({
        variant: "destructive",
        title: "Dados inválidos",
        description: "Aluno ou produto não encontrado.",
      });
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 19).replace('T', ' ');
    
    const novaVenda: Venda = {
      id: vendas.length > 0 ? Math.max(...vendas.map(v => v.id)) + 1 : 1,
      aluno_id: aluno.id,
      aluno_nome: aluno.nome,
      produto_id: produto.id,
      produto_nome: produto.nome,
      quantidade,
      total: produto.preco * quantidade,
      forma_pagamento: formaPagamento,
      data: formattedDate,
    };

    // Adicionar à lista de vendas
    setVendas([novaVenda, ...vendas]);
    
    // Se for fiado, atualizar ou criar registro de devedor
    if (formaPagamento === 'fiado') {
      let updatedDevedores = [...devedores];
      let devedor = devedores.find(d => d.aluno_id === aluno.id);
      
      if (devedor) {
        // Atualizar devedor existente
        devedor = {
          ...devedor,
          saldo: devedor.saldo + novaVenda.total,
          historico: [
            {
              id: Math.max(...devedor.historico.map(h => h.id)) + 1,
              tipo: 'venda',
              valor: novaVenda.total,
              data: formattedDate,
              descricao: `${novaVenda.produto_nome} (${novaVenda.quantidade}x)`,
            },
            ...devedor.historico,
          ],
        };
        
        updatedDevedores = updatedDevedores.map(d => 
          d.aluno_id === aluno.id ? devedor! : d
        );
      } else {
        // Criar novo devedor
        const novoDevedor: Devedor = {
          aluno_id: aluno.id,
          nome: aluno.nome,
          saldo: novaVenda.total,
          responsavel_id: aluno.responsavel_id,
          historico: [
            {
              id: 1,
              tipo: 'venda',
              valor: novaVenda.total,
              data: formattedDate,
              descricao: `${novaVenda.produto_nome} (${novaVenda.quantidade}x)`,
            },
          ],
        };
        
        updatedDevedores = [novoDevedor, ...updatedDevedores];
      }
      
      setDevedores(updatedDevedores);
      
      // Enviar notificação para o responsável se existir um
      if (aluno.responsavel_id) {
        const responsavel = responsaveis.find(r => r.id === aluno.responsavel_id);
        const devedorAtual = updatedDevedores.find(d => d.aluno_id === aluno.id);
        
        if (responsavel && devedorAtual) {
          try {
            const result = await notificarVendaFiado(responsavel, aluno, novaVenda, devedorAtual.saldo);
            
            if (result.some(r => r.success)) {
              toast({
                title: "Notificação enviada",
                description: `O responsável ${responsavel.nome} foi notificado sobre esta compra.`,
              });
            }
          } catch (error) {
            console.error("Erro ao enviar notificação:", error);
          }
        }
      }
    }
    
    // Reset form
    setAlunoId('');
    setProdutoId('');
    setQuantidade(1);
    setFormaPagamento('dinheiro');
    
    toast({
      title: "Venda registrada",
      description: `Venda de ${produto.nome} para ${aluno.nome} registrada com sucesso.`,
    });
  };

  // Get responsavel name by aluno id
  const getResponsavelName = (alunoId: number): string => {
    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno || !aluno.responsavel_id) return "Sem responsável";
    
    const responsavel = responsaveis.find(r => r.id === aluno.responsavel_id);
    return responsavel ? responsavel.nome : "Não encontrado";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Registrar Vendas</h1>
          <p className="text-muted-foreground">Registre vendas rápidas para os alunos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Nova Venda</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="aluno" className="block text-sm font-medium text-gray-700 mb-1">
                      Selecione o Aluno
                    </label>
                    <select
                      id="aluno"
                      className="form-select"
                      value={alunoId}
                      onChange={e => setAlunoId(e.target.value)}
                    >
                      <option value="">— Selecione um aluno —</option>
                      {alunos.map(aluno => (
                        <option key={aluno.id} value={aluno.id}>
                          {aluno.nome} ({aluno.turma})
                          {aluno.responsavel_id ? ` - Resp: ${getResponsavelName(aluno.id)}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="produto" className="block text-sm font-medium text-gray-700 mb-1">
                      Selecione o Produto
                    </label>
                    <select
                      id="produto"
                      className="form-select"
                      value={produtoId}
                      onChange={e => setProdutoId(e.target.value)}
                    >
                      <option value="">— Selecione um produto —</option>
                      {produtos.map(produto => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.preco.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      id="quantidade"
                      className="form-input"
                      value={quantidade}
                      onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                  </div>

                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-2">
                      Forma de Pagamento
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="formaPagamento" 
                          checked={formaPagamento === 'dinheiro'} 
                          onChange={() => setFormaPagamento('dinheiro')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="flex items-center">
                          <DollarSign size={16} className="mr-1" />
                          Dinheiro
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="formaPagamento" 
                          checked={formaPagamento === 'pix'} 
                          onChange={() => setFormaPagamento('pix')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="flex items-center">
                          <CreditCard size={16} className="mr-1" />
                          Pix
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="formaPagamento" 
                          checked={formaPagamento === 'fiado'} 
                          onChange={() => setFormaPagamento('fiado')}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="flex items-center">
                          <ShoppingCart size={16} className="mr-1" />
                          Fiado
                        </span>
                      </label>
                    </div>
                    {formaPagamento === 'fiado' && parseInt(alunoId) > 0 && !alunos.find(a => a.id === parseInt(alunoId))?.responsavel_id && (
                      <div className="mt-2 text-amber-500 text-sm flex items-center">
                        <Mail className="mr-1" size={16} />
                        <span>Aluno sem responsável cadastrado. Não será possível enviar notificação.</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">
                      Total da Venda
                    </p>
                    <div className="text-3xl font-bold text-primary">
                      R$ {totalVenda.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={handleRegistrarVenda}
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={!alunoId || !produtoId || quantidade < 1}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Registrar Venda
                  </button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-6 h-full">
              <h2 className="text-xl font-bold mb-6">Últimas Vendas</h2>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : vendas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma venda registrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendas.map(venda => (
                    <div key={venda.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{venda.aluno_nome}</p>
                          <p className="text-sm text-muted-foreground">{venda.produto_nome}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {venda.total.toFixed(2)}</p>
                          <div className="flex items-center text-xs text-muted-foreground capitalize">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                              venda.forma_pagamento === 'dinheiro' ? 'bg-green-500' : 
                              venda.forma_pagamento === 'pix' ? 'bg-blue-500' : 'bg-amber-500'
                            }`}></span>
                            {venda.forma_pagamento}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{venda.quantidade} {venda.quantidade > 1 ? 'unidades' : 'unidade'}</span>
                        <span>{new Date(venda.data).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vendas;
