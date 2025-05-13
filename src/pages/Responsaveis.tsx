
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Responsavel {
  id: number;
  nome: string;
  whatsapp: string;
  email: string;
}

// Simulated data for demonstration
const responsaveisMock: Responsavel[] = [
  { id: 1, nome: 'Maria Silva', whatsapp: '(11) 98765-4321', email: 'maria@email.com' },
  { id: 2, nome: 'João Santos', whatsapp: '(11) 91234-5678', email: 'joao@email.com' },
  { id: 3, nome: 'Fernanda Oliveira', whatsapp: '(11) 99876-5432', email: 'fernanda@email.com' },
  { id: 4, nome: 'Ricardo Lima', whatsapp: '(11) 98888-7777', email: 'ricardo@email.com' },
];

const Responsaveis: React.FC = () => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch responsaveis on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResponsaveis(responsaveisMock);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddResponsavel = () => {
    if (!nome.trim() || !whatsapp.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e o WhatsApp do responsável.",
      });
      return;
    }

    const newResponsavel = {
      id: responsaveis.length > 0 ? Math.max(...responsaveis.map(r => r.id)) + 1 : 1,
      nome,
      whatsapp,
      email,
    };

    setResponsaveis([newResponsavel, ...responsaveis]);
    setNome('');
    setWhatsapp('');
    setEmail('');

    toast({
      title: "Responsável adicionado",
      description: `${nome} foi cadastrado com sucesso.`,
    });
  };

  const startEditing = (responsavel: Responsavel) => {
    setEditingId(responsavel.id);
    setNome(responsavel.nome);
    setWhatsapp(responsavel.whatsapp);
    setEmail(responsavel.email);
  };

  const handleUpdateResponsavel = () => {
    if (!nome.trim() || !whatsapp.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e o WhatsApp do responsável.",
      });
      return;
    }

    setResponsaveis(responsaveis.map(responsavel => 
      responsavel.id === editingId ? { ...responsavel, nome, whatsapp, email } : responsavel
    ));
    
    setEditingId(null);
    setNome('');
    setWhatsapp('');
    setEmail('');
    
    toast({
      title: "Responsável atualizado",
      description: "Os dados do responsável foram atualizados com sucesso.",
    });
  };

  const handleDeleteResponsavel = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este responsável?")) {
      setResponsaveis(responsaveis.filter(responsavel => responsavel.id !== id));
      
      toast({
        title: "Responsável excluído",
        description: "O responsável foi removido com sucesso.",
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNome('');
    setWhatsapp('');
    setEmail('');
  };

  // Filter responsaveis based on search query
  const filteredResponsaveis = responsaveis.filter(responsavel => 
    responsavel.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    responsavel.whatsapp.includes(searchQuery) ||
    responsavel.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Responsáveis</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os responsáveis dos alunos</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Responsável' : 'Cadastrar Novo Responsável'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                className="form-input"
                placeholder="Nome do responsável"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                id="whatsapp"
                className="form-input"
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              {editingId ? (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleUpdateResponsavel} 
                    className="btn-primary flex items-center"
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
                </div>
              ) : (
                <button 
                  onClick={handleAddResponsavel} 
                  className="btn-primary flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Adicionar Responsável
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold">Lista de Responsáveis</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-9 form-input w-full md:w-64"
                placeholder="Buscar responsáveis..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredResponsaveis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum responsável encontrado para a busca." : "Nenhum responsável cadastrado."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>WhatsApp</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponsaveis.map(responsavel => (
                    <tr key={responsavel.id}>
                      <td>{responsavel.id}</td>
                      <td>{responsavel.nome}</td>
                      <td>{responsavel.whatsapp}</td>
                      <td>{responsavel.email || "-"}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(responsavel)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteResponsavel(responsavel.id)}
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

export default Responsaveis;
