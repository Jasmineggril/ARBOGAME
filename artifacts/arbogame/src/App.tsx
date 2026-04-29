import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

const Home = lazy(() => import("@/pages/Home"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Missao = lazy(() => import("@/pages/Missao"));
const Jogos = lazy(() => import("@/pages/Jogos"));
const JogosApp = lazy(() => import("@/pages/JogosApp"));
const Ranking = lazy(() => import("@/pages/Ranking"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CriarJogo = lazy(() => import("@/pages/CriarJogo"));
const MeusJogos = lazy(() => import("@/pages/MeusJogos"));
const Resultados = lazy(() => import("@/pages/Resultados"));
const Metodologia = lazy(() => import("@/pages/Metodologia"));
const Impacto = lazy(() => import("@/pages/Impacto"));
const Equipe = lazy(() => import("@/pages/Equipe"));
const Pibex = lazy(() => import("@/pages/Pibex"));
const Pic = lazy(() => import("@/pages/Pic"));
const Producao = lazy(() => import("@/pages/Producao"));
const Futuro = lazy(() => import("@/pages/Futuro"));
const Admin = lazy(() => import("@/pages/admin/Admin"));
const Contato = lazy(() => import("@/pages/Contato"));
const NotFound = lazy(() => import("@/pages/not-found"));

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
      <Route path="/jogos-app" component={JogosApp} />
      <Route path="/ranking" component={Ranking} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/criar-jogo" component={CriarJogo} />
      <Route path="/meus-jogos" component={MeusJogos} />
      <Route path="/resultados" component={Resultados} />
      <Route path="/metodologia" component={Metodologia} />
      <Route path="/impacto" component={Impacto} />
      <Route path="/equipe" component={Equipe} />
      <Route path="/pibex" component={Pibex} />
      <Route path="/pic" component={Pic} />
      <Route path="/producao" component={Producao} />
      <Route path="/futuro" component={Futuro} />
      <Route path="/contato" component={Contato} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Suspense
                fallback={
                  <div className="container mx-auto flex min-h-[40vh] items-center justify-center px-4 py-16 text-sm text-muted-foreground md:px-6">
                    Carregando conteúdo...
                  </div>
                }
              >
                <Router />
              </Suspense>
            </Layout>
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
