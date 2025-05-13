
import React, { useEffect, useState } from 'react';
import { BarChart, DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { Chart } from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

import { useNavigate } from 'react-router-dom';

interface DashboardData {
  totalAlunos: number;
  totalVendas: number;
  receitaTotal: number;
  valorFiado: number;
  vendasPorDia: Array<{name: string, vendas: number}>;
  produtosPopulares: Array<{nome: string, vendas: number}>;
}

// Mock data for dashboard demonstration
const mockData: DashboardData = {
  totalAlunos: 78,
  totalVendas: 256,
  receitaTotal: 2345.67,
  valorFiado: 546.25,
  vendasPorDia: [
    { name: "Seg", vendas: 15 },
    { name: "Ter", vendas: 22 },
    { name: "Qua", vendas: 18 },
    { name: "Qui", vendas: 25 },
    { name: "Sex", vendas: 32 },
  ],
  produtosPopulares: [
    { nome: "Coxinha", vendas: 45 },
    { nome: "Refrigerante", vendas: 38 },
    { nome: "Chocolate", vendas: 29 },
    { nome: "Salgadinho", vendas: 27 },
    { nome: "Pão de queijo", vendas: 25 },
  ]
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/login');
      return;
    }
    
    // Simulate API call to get dashboard data
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema da cantina</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Alunos</p>
                <h3 className="text-2xl font-bold">{data?.totalAlunos}</h3>
              </div>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600">
                <ShoppingBag size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Vendas</p>
                <h3 className="text-2xl font-bold">{data?.totalVendas}</h3>
              </div>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600">
                <DollarSign size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <h3 className="text-2xl font-bold">R$ {data?.receitaTotal.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          
          <div className="card bg-white">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 text-amber-600">
                <TrendingUp size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Fiado</p>
                <h3 className="text-2xl font-bold">R$ {data?.valorFiado.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Vendas por dia</h3>
            <div className="h-80">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                  },
                  colors: ['#3b82f6'],
                  xaxis: {
                    categories: data?.vendasPorDia.map(d => d.name) || [],
                  },
                }}
                series={[{
                  name: 'Vendas',
                  data: data?.vendasPorDia.map(d => d.vendas) || [],
                }]}
                type="bar"
                height="100%"
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Produtos Populares</h3>
            <div className="h-80">
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                  },
                  colors: ['#10b981'],
                  xaxis: {
                    categories: data?.produtosPopulares.map(p => p.nome) || [],
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                    }
                  }
                }}
                series={[{
                  name: 'Vendas',
                  data: data?.produtosPopulares.map(p => p.vendas) || [],
                }]}
                type="bar"
                height="100%"
              />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ações Rápidas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/vendas')} 
                className="btn-primary flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                Nova Venda
              </button>
              <button 
                onClick={() => navigate('/alunos')} 
                className="btn-secondary flex items-center justify-center"
              >
                <Users size={18} className="mr-2" />
                Novo Aluno
              </button>
              <button 
                onClick={() => navigate('/produtos')} 
                className="btn-secondary flex items-center justify-center"
              >
                <Coffee size={18} className="mr-2" />
                Novo Produto
              </button>
              <button 
                onClick={() => navigate('/fiado')} 
                className="btn-secondary flex items-center justify-center"
              >
                <DollarSign size={18} className="mr-2" />
                Ver Fiado
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Dicas</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </div>
                <p>Registre vendas fiado apenas para alunos com responsáveis cadastrados.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </div>
                <p>Verifique diariamente o relatório de vendas para acompanhar os produtos mais vendidos.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </div>
                <p>Envie notificações para os responsáveis sobre o saldo fiado acumulado semanalmente.</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
