
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, MessageSquare, Bell, Settings } from 'lucide-react';
import { getNotificacaoConfig } from '@/services/notification';
import { NotificacaoConfig } from '@/types';

// Componentes refatorados
import ConfiguracaoGeral from '@/components/comunicacoes/ConfiguracaoGeral';
import ConfiguracaoEmail from '@/components/comunicacoes/ConfiguracaoEmail';
import ConfiguracaoWhatsApp from '@/components/comunicacoes/ConfiguracaoWhatsApp';
import ConfiguracaoRegras from '@/components/comunicacoes/ConfiguracaoRegras';
import ComunicacoesHeader from '@/components/comunicacoes/ComunicacoesHeader';

const Comunicacoes: React.FC = () => {
  const [config, setConfig] = useState<NotificacaoConfig>(getNotificacaoConfig());
  const [salvando, setSalvando] = useState(false);
  const { toast } = useToast();
  const [previewTemplate, setPreviewTemplate] = useState('');
  
  // Gerar visualização do template
  useEffect(() => {
    let template = config.conteudo.mensagem;
    template = template
      .replace('{responsavel}', 'Maria Silva')
      .replace('{aluno}', 'João Silva');
      
    if (config.conteudo.incluirDetalhesCompra) {
      template = template.replace('{detalhes_compra}', `
Produto: Lanche completo
Quantidade: 1
Valor total: R$ 15,00
Data: ${new Date().toLocaleString('pt-BR')}
      `);
    } else {
      template = template.replace('{detalhes_compra}', '');
    }
    
    if (config.conteudo.incluirSaldoTotal) {
      template = template.replace('{saldo_total}', 'O saldo devedor atual é de R$ 45,50.');
    } else {
      template = template.replace('{saldo_total}', '');
    }
    
    setPreviewTemplate(template);
  }, [config]);

  // Salvar configurações no localStorage
  const salvarConfiguracoes = () => {
    setSalvando(true);
    setTimeout(() => {
      localStorage.setItem('notificacaoConfig', JSON.stringify(config));
      setSalvando(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações de comunicação foram salvas com sucesso.",
      });
    }, 500);
  };

  // Restaurar configurações padrão
  const restaurarPadrao = () => {
    if (window.confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      const defaultConfig: NotificacaoConfig = {
        ativa: true,
        metodos: {
          email: true,
          whatsapp: false
        },
        frequencia: 'imediato' as 'imediato' | 'diario' | 'semanal',
        conteudo: {
          incluirDetalhesCompra: true,
          incluirSaldoTotal: true,
          assunto: 'Notificação de consumo na cantina',
          mensagem: 'Olá {responsavel}, informamos que {aluno} realizou um consumo na cantina da escola. {detalhes_compra} {saldo_total}'
        }
      };
      
      setConfig(defaultConfig);
      localStorage.setItem('notificacaoConfig', JSON.stringify(defaultConfig));
      
      toast({
        title: "Configurações restauradas",
        description: "As configurações foram restauradas para os valores padrão.",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <ComunicacoesHeader />

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="geral" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              E-mail
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="regras" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Regras
            </TabsTrigger>
          </TabsList>
          
          {/* Aba Geral */}
          <TabsContent value="geral" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações Gerais</h2>
              <ConfiguracaoGeral 
                config={config}
                setConfig={setConfig}
                salvando={salvando}
                salvarConfiguracoes={salvarConfiguracoes}
                restaurarPadrao={restaurarPadrao}
              />
            </Card>
          </TabsContent>
          
          {/* Aba E-mail */}
          <TabsContent value="email" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações de E-mail</h2>
              <ConfiguracaoEmail 
                config={config}
                setConfig={setConfig}
                previewTemplate={previewTemplate}
                salvando={salvando}
                salvarConfiguracoes={salvarConfiguracoes}
              />
            </Card>
          </TabsContent>
          
          {/* Aba WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações de WhatsApp</h2>
              <ConfiguracaoWhatsApp />
            </Card>
          </TabsContent>
          
          {/* Aba Regras */}
          <TabsContent value="regras" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Regras de Envio</h2>
              <ConfiguracaoRegras 
                salvando={salvando}
                salvarConfiguracoes={salvarConfiguracoes}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Comunicacoes;
