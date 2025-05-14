
import React from 'react';
import { Info, CheckCircle } from 'lucide-react';
import { NotificacaoConfig } from '@/types';

interface ConfiguracaoRegrasProps {
  salvando: boolean;
  salvarConfiguracoes: () => void;
}

const ConfiguracaoRegras: React.FC<ConfiguracaoRegrasProps> = ({
  salvando,
  salvarConfiguracoes,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Info size={18} className="text-blue-500 mr-2" />
        <p className="text-sm text-blue-500">
          A configuração avançada de regras de envio será implementada em uma versão futura.
          Atualmente apenas as regras básicas estão disponíveis.
        </p>
      </div>
      
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
  );
};

export default ConfiguracaoRegras;
