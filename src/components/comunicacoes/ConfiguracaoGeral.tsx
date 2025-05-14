
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { NotificacaoConfig } from '@/types';

interface ConfiguracaoGeralProps {
  config: NotificacaoConfig;
  setConfig: React.Dispatch<React.SetStateAction<NotificacaoConfig>>;
  salvando: boolean;
  salvarConfiguracoes: () => void;
  restaurarPadrao: () => void;
}

const ConfiguracaoGeral: React.FC<ConfiguracaoGeralProps> = ({
  config,
  setConfig,
  salvando,
  salvarConfiguracoes,
  restaurarPadrao
}) => {
  return (
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
  );
};

export default ConfiguracaoGeral;
