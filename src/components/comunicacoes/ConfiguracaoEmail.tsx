
import React from 'react';
import { Info, CheckCircle } from 'lucide-react';
import { NotificacaoConfig } from '@/types';

interface ConfiguracaoEmailProps {
  config: NotificacaoConfig;
  setConfig: React.Dispatch<React.SetStateAction<NotificacaoConfig>>;
  previewTemplate: string;
  salvando: boolean;
  salvarConfiguracoes: () => void;
}

const ConfiguracaoEmail: React.FC<ConfiguracaoEmailProps> = ({
  config,
  setConfig,
  previewTemplate,
  salvando,
  salvarConfiguracoes,
}) => {
  return (
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
  );
};

export default ConfiguracaoEmail;
