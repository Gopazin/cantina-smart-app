
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GuardedRoute from "./components/GuardedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Alunos from "./pages/Alunos";
import Responsaveis from "./pages/Responsaveis";
import Produtos from "./pages/Produtos";
import Vendas from "./pages/Vendas";
import Fiado from "./pages/Fiado";
import Comunicacoes from "./pages/Comunicacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <GuardedRoute>
                <Index />
              </GuardedRoute>
            }
          />
          <Route 
            path="/alunos" 
            element={
              <GuardedRoute>
                <Alunos />
              </GuardedRoute>
            }
          />
          <Route 
            path="/responsaveis" 
            element={
              <GuardedRoute>
                <Responsaveis />
              </GuardedRoute>
            }
          />
          <Route 
            path="/produtos" 
            element={
              <GuardedRoute>
                <Produtos />
              </GuardedRoute>
            }
          />
          <Route 
            path="/vendas" 
            element={
              <GuardedRoute>
                <Vendas />
              </GuardedRoute>
            }
          />
          <Route 
            path="/fiado" 
            element={
              <GuardedRoute>
                <Fiado />
              </GuardedRoute>
            }
          />
          <Route 
            path="/comunicacoes" 
            element={
              <GuardedRoute>
                <Comunicacoes />
              </GuardedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
