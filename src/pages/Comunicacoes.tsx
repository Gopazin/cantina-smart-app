import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Mail, MessageSquare, Bell, Settings, CheckCircle, Info } from 'lucide-react';
import { getNotificacaoConfig } from '@/services/notification';
import { NotificacaoConfig } from '@/types';

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
        <div>
          <h1 className="text-2xl font-bold">Configurações de Comunicação</h1>
          <p className="text-muted-foreground">Configure notificações para responsáveis</p>
        </div>

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
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações ativas</p>
                    <p className="text-sm text-muted-foreground">Ativar ou desativar todas as notificações</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={config.ativa} 
                      onChange={e => setConfig({...config, ativa: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Métodos de notificação</p>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.metodos.email}
                        onChange={e => setConfig({
                          ...config, 
                          metodos: {...config.metodos, email: e.target.checked}
                        })}
                      />
                      <span>E-mail</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.metodos.whatsapp}
                        onChange={e => setConfig({
                          ...config, 
                          metodos: {...config.metodos, whatsapp: e.target.checked}
                        })}
                      />
                      <span>WhatsApp</span>
                    </label>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Frequência de envio</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="frequencia" 
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" 
                        checked={config.frequencia === 'imediato'}
                        onChange={() => setConfig({...config, frequencia: 'imediato'})}
                      />
                      <span className="ml-2">Imediato</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="frequencia" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.frequencia === 'diario'}
                        onChange={() => setConfig({...config, frequencia: 'diario'})}
                      />
                      <span className="ml-2">Diário</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="frequencia" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.frequencia === 'semanal'}
                        onChange={() => setConfig({...config, frequencia: 'semanal'})}
                      />
                      <span className="ml-2">Semanal</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  <button 
                    onClick={restaurarPadrao}
                    className="btn-secondary"
                  >
                    Restaurar Padrão
                  </button>
                  <button 
                    onClick={salvarConfiguracoes}
                    className="btn-primary flex items-center"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Aba E-mail */}
          <TabsContent value="email" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações de E-mail</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <Info size={18} className="text-blue-500 mr-2" />
                    <p className="text-sm text-blue-500">
                      As configurações de conexão com serviços de e-mail serão implementadas futuramente. 
                      Atualmente o sistema está no modo de simulação.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="assuntoEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto do E-mail
                    </label>
                    <input
                      type="text"
                      id="assuntoEmail"
                      className="form-input w-full"
                      value={config.conteudo.assunto}
                      onChange={e => setConfig({
                        ...config, 
                        conteudo: {...config.conteudo, assunto: e.target.value}
                      })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Você pode usar as variáveis: {'{aluno}'}, {'{valor}'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="conteudoEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo da mensagem
                    </label>
                    <textarea
                      id="conteudoEmail"
                      rows={6}
                      className="form-input w-full"
                      value={config.conteudo.mensagem}
                      onChange={e => setConfig({
                        ...config, 
                        conteudo: {...config.conteudo, mensagem: e.target.value}
                      })}
                    ></textarea>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você pode usar as variáveis: {'{responsavel}'}, {'{aluno}'}, {'{detalhes_compra}'}, {'{saldo_total}'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-2 mb-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.conteudo.incluirDetalhesCompra}
                        onChange={e => setConfig({
                          ...config, 
                          conteudo: {...config.conteudo, incluirDetalhesCompra: e.target.checked}
                        })}
                      />
                      <span>Incluir detalhes da compra</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={config.conteudo.incluirSaldoTotal}
                        onChange={e => setConfig({
                          ...config, 
                          conteudo: {...config.conteudo, incluirSaldoTotal: e.target.checked}
                        })}
                      />
                      <span>Incluir saldo devedor total</span>
                    </label>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Prévia da mensagem</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border whitespace-pre-line">
                    {previewTemplate}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    onClick={salvarConfiguracoes}
                    className="btn-primary flex items-center"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Aba WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações de WhatsApp</h2>
              <div className="flex items-center mb-4">
                <Info size={18} className="text-blue-500 mr-2" />
                <p className="text-sm text-blue-500">
                  A integração com WhatsApp será implementada em uma versão futura.
                  Atualmente o sistema está no modo de simulação.
                </p>
              </div>
              
              <div className="border p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Opções disponíveis em breve:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Integração com WhatsApp Business API</li>
                  <li>Modelos de mensagem personalizados</li>
                  <li>Envio de relatórios e comprovantes</li>
                  <li>Mensagens automáticas para lembretes de pagamento</li>
                  <li>QR Code para sincronização com WhatsApp Web</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
          
          {/* Aba Regras */}
          <TabsContent value="regras" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Regras de Envio</h2>
              
              <div className="flex items-center mb-6">
                <Info size={18} className="text-blue-500 mr-2" />
                <p className="text-sm text-blue-500">
                  A configuração avançada de regras de envio será implementada em uma versão futura.
                  Atualmente apenas as regras básicas estão disponíveis.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Situações para envio de notificações:</h3>
                  
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={true} 
                        readOnly
                      />
                      <div className="ml-2">
                        <p className="font-medium">Nova compra fiado</p>
                        <p className="text-sm text-muted-foreground">
                          Notificar quando um aluno fizer uma compra fiado
                        </p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={false} 
                        disabled
                      />
                      <div className="ml-2 opacity-60">
                        <p className="font-medium">Lembrete de pagamento</p>
                        <p className="text-sm text-muted-foreground">
                          Enviar lembretes periódicos sobre saldo devedor
                        </p>
                        <p className="text-xs text-blue-500 mt-1">Disponível em breve</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                        checked={false} 
                        disabled
                      />
                      <div className="ml-2 opacity-60">
                        <p className="font-medium">Registro de pagamento</p>
                        <p className="text-sm text-muted-foreground">
                          Confirmar quando um pagamento for registrado
                        </p>
                        <p className="text-xs text-blue-500 mt-1">Disponível em breve</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <button 
                    onClick={salvarConfiguracoes}
                    className="btn-primary flex items-center"
                    disabled={salvando}
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Salvar Configurações
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Comunicacoes;
