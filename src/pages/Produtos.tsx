
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
}

const CATEGORIAS = ['salgados', 'doces', 'bolos', 'bebidas', 'outros'];

// Simulated data for demonstration
const produtosMock: Produto[] = [
  { id: 1, nome: 'Coxinha', categoria: 'salgados', preco: 5.50 },
  { id: 2, nome: 'Chocolate', categoria: 'doces', preco: 3.00 },
  { id: 3, nome: 'Bolo de Chocolate', categoria: 'bolos', preco: 6.00 },
  { id: 4, nome: 'Refrigerante Lata', categoria: 'bebidas', preco: 5.00 },
  { id: 5, nome: 'Pão de Queijo', categoria: 'salgados', preco: 4.50 },
];

const Produtos: React.FC = () => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [preco, setPreco] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch produtos on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProdutos(produtosMock);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddProduto = () => {
    if (!nome.trim() || !preco.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e o preço do produto.",
      });
      return;
    }

    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber) || precoNumber <= 0) {
      toast({
        variant: "destructive",
        title: "Preço inválido",
        description: "Digite um valor numérico válido para o preço.",
      });
      return;
    }

    const newProduto = {
      id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
      nome,
      categoria,
      preco: precoNumber,
    };

    setProdutos([newProduto, ...produtos]);
    setNome('');
    setPreco('');
    setCategoria(CATEGORIAS[0]);

    toast({
      title: "Produto adicionado",
      description: `${nome} foi cadastrado com sucesso.`,
    });
  };

  const startEditing = (produto: Produto) => {
    setEditingId(produto.id);
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setPreco(produto.preco.toString());
  };

  const handleUpdateProduto = () => {
    if (!nome.trim() || !preco.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e o preço do produto.",
      });
      return;
    }

    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber) || precoNumber <= 0) {
      toast({
        variant: "destructive",
        title: "Preço inválido",
        description: "Digite um valor numérico válido para o preço.",
      });
      return;
    }

    setProdutos(produtos.map(produto => 
      produto.id === editingId ? { ...produto, nome, categoria, preco: precoNumber } : produto
    ));
    
    setEditingId(null);
    setNome('');
    setCategoria(CATEGORIAS[0]);
    setPreco('');
    
    toast({
      title: "Produto atualizado",
      description: "Os dados do produto foram atualizados com sucesso.",
    });
  };

  const handleDeleteProduto = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter(produto => produto.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso.",
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNome('');
    setCategoria(CATEGORIAS[0]);
    setPreco('');
  };

  // Filter produtos based on search query
  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    produto.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os produtos da cantina</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                id="nome"
                className="form-input"
                placeholder="Nome do produto"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="categoria"
                className="form-select"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                id="preco"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0,00"
                value={preco}
                onChange={e => setPreco(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              {editingId ? (
                <>
                  <button 
                    onClick={handleUpdateProduto} 
                    className="btn-primary mr-2 flex items-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Atualizar
                  </button>
                  <button 
                    onClick={cancelEditing} 
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAddProduto} 
                  className="btn-primary flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Adicionar Produto
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold">Catálogo de Produtos</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-9 form-input w-full md:w-64"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProdutos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum produto encontrado para a busca." : "Nenhum produto cadastrado."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProdutos.map(produto => (
                    <tr key={produto.id}>
                      <td>{produto.id}</td>
                      <td>{produto.nome}</td>
                      <td>
                        <span className="capitalize">{produto.categoria}</span>
                      </td>
                      <td>R$ {produto.preco.toFixed(2)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(produto)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduto(produto.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Produtos;
