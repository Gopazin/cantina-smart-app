
import React from 'react';
import { Info } from 'lucide-react';

const ConfiguracaoWhatsApp: React.FC = () => {
  return (
    <div>
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
    </div>
  );
};

export default ConfiguracaoWhatsApp;
