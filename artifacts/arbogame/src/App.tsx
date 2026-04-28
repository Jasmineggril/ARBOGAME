import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Sobre from "@/pages/Sobre";
import Missao from "@/pages/Missao";
import Jogos from "@/pages/Jogos";
import Resultados from "@/pages/Resultados";
import Metodologia from "@/pages/Metodologia";
import Impacto from "@/pages/Impacto";
import Equipe from "@/pages/Equipe";
import Pibex from "@/pages/Pibex";
import Pic from "@/pages/Pic";
import Producao from "@/pages/Producao";
import Futuro from "@/pages/Futuro";
import Admin from "@/pages/admin/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/missao" component={Missao} />
      <Route path="/jogos" component={Jogos} />
      <Route path="/resultados" component={Resultados} />
      <Route path="/metodologia" component={Metodologia} />
      <Route path="/impacto" component={Impacto} />
      <Route path="/equipe" component={Equipe} />
      <Route path="/pibex" component={Pibex} />
      <Route path="/pic" component={Pic} />
      <Route path="/producao" component={Producao} />
      <Route path="/futuro" component={Futuro} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
