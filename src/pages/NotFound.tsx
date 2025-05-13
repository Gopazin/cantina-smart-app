
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-6">Página não encontrada</h2>
        <p className="mt-4 text-muted-foreground">
          A página que você está procurando não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 btn-primary"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
};

export default NotFound;
