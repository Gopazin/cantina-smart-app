
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Aluno {
  id: number;
  nome: string;
  turma: string;
}

// Simulated data for demonstration
const alunosMock: Aluno[] = [
  { id: 1, nome: 'Ana Silva', turma: '5º Ano A' },
  { id: 2, nome: 'Bruno Santos', turma: '3º Ano B' },
  { id: 3, nome: 'Carla Oliveira', turma: '7º Ano A' },
  { id: 4, nome: 'Daniel Lima', turma: '9º Ano C' },
  { id: 5, nome: 'Elena Martins', turma: '2º Ano A' },
];

const Alunos: React.FC = () => {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch alunos on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlunos(alunosMock);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddAluno = () => {
    if (!nome.trim() || !turma.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e a turma do aluno.",
      });
      return;
    }

    const newAluno = {
      id: alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1,
      nome,
      turma,
    };

    setAlunos([newAluno, ...alunos]);
    setNome('');
    setTurma('');

    toast({
      title: "Aluno adicionado",
      description: `${nome} foi cadastrado com sucesso.`,
    });
  };

  const startEditing = (aluno: Aluno) => {
    setEditingId(aluno.id);
    setNome(aluno.nome);
    setTurma(aluno.turma);
  };

  const handleUpdateAluno = () => {
    if (!nome.trim() || !turma.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e a turma do aluno.",
      });
      return;
    }

    setAlunos(alunos.map(aluno => 
      aluno.id === editingId ? { ...aluno, nome, turma } : aluno
    ));
    
    setEditingId(null);
    setNome('');
    setTurma('');
    
    toast({
      title: "Aluno atualizado",
      description: "Os dados do aluno foram atualizados com sucesso.",
    });
  };

  const handleDeleteAluno = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      setAlunos(alunos.filter(aluno => aluno.id !== id));
      
      toast({
        title: "Aluno excluído",
        description: "O aluno foi removido com sucesso.",
      });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNome('');
    setTurma('');
  };

  // Filter alunos based on search query
  const filteredAlunos = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
    aluno.turma.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Alunos</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os alunos do sistema</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                className="form-input"
                placeholder="Nome do aluno"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">
                Turma
              </label>
              <input
                type="text"
                id="turma"
                className="form-input"
                placeholder="Ex: 5º Ano A"
                value={turma}
                onChange={e => setTurma(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              {editingId ? (
                <>
                  <button 
                    onClick={handleUpdateAluno} 
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
                  onClick={handleAddAluno} 
                  className="btn-primary flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Adicionar Aluno
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Lista de Alunos</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="pl-9 form-input w-full md:w-64"
                placeholder="Buscar alunos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredAlunos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum aluno encontrado para a busca." : "Nenhum aluno cadastrado."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Turma</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlunos.map(aluno => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.turma}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(aluno)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAluno(aluno.id)}
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

export default Alunos;
