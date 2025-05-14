
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface BotaoSalvarProps {
  salvando: boolean;
  onClick: () => void;
}

const BotaoSalvar: React.FC<BotaoSalvarProps> = ({ salvando, onClick }) => {
  return (
    <button 
      onClick={onClick}
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
  );
};

export default BotaoSalvar;
