
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Coffee, Users, ShoppingBag, DollarSign, CreditCard, BarChart2, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const logout = () => {
    localStorage.removeItem('isAdmin');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <BarChart2 size={20} />, path: '/' },
    { name: 'Alunos', icon: <Users size={20} />, path: '/alunos' },
    { name: 'Responsáveis', icon: <Users size={20} />, path: '/responsaveis' },
    { name: 'Produtos', icon: <Coffee size={20} />, path: '/produtos' },
    { name: 'Vendas', icon: <ShoppingBag size={20} />, path: '/vendas' },
    { name: 'Fiado', icon: <CreditCard size={20} />, path: '/fiado' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-50 p-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="text-foreground focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative z-40 w-64 h-full transition-transform duration-300 ease-in-out bg-white border-r`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold text-primary flex items-center">
              <Coffee className="mr-2" />
              Cantina App
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-sm rounded-md cursor-pointer transition-colors ${
                      window.location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="cantina-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
