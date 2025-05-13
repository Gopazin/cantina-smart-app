
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOGIN_USER = 'admin';
const LOGIN_PASS = 'admin';

const Login: React.FC = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.getItem('isAdmin') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (user === LOGIN_USER && pass === LOGIN_PASS) {
        localStorage.setItem('isAdmin', 'true');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema da Cantina.",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Credenciais inválidas. Tente novamente.",
        });
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Coffee size={48} className="text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Cantina App</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Faça login para acessar o sistema
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
                className="form-input mt-1"
                placeholder="Usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input mt-1"
                placeholder="Senha"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
              ) : null}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Use admin/admin para demonstração</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
