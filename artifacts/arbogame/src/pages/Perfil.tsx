import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { User, Mail, TrendingUp, Gamepad2, Award, Clock } from "lucide-react";

export default function Perfil() {
  const { user, logout } = useAuth();
  const [_location, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      setTimeout(() => navigate("/"), 100);
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const stats = [
    { icon: Gamepad2, label: "Jogos Jogados", value: "12" },
    { icon: Award, label: "Achievements", value: "8" },
    { icon: TrendingUp, label: "Pontuação Total", value: "2,450" },
    { icon: Clock, label: "Tempo Jogado", value: "15h 32m" },
  ];

  return (
    <main className="flex-1">
      <SectionHeader
        title="Meu Perfil"
        description="Gerencie sua conta e acompanhe seu progresso"
      />

      <div className="container mx-auto max-w-screen-2xl space-y-8 px-4 py-8 md:px-6 md:py-12">
        {/* Informações do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Seus dados de cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                <Mail className="inline mr-2 h-4 w-4" />
                E-mail
              </label>
              <p className="text-lg font-semibold text-primary">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Suas Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="hover-elevate">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <Icon className="h-8 w-8 text-primary/50" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Histórico de Jogos */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
            <CardDescription>Seus últimos 5 jogos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { game: "Caça ao Mosquito", score: 850, date: "Hoje" },
                { game: "Trilha das Arboviroses", score: 720, date: "Ontem" },
                { game: "Quiz de Saúde", score: 880, date: "2 dias atrás" },
                { game: "Caça ao Mosquito", score: 910, date: "3 dias atrás" },
                { game: "Quiz de Saúde", score: 760, date: "1 semana atrás" },
              ].map((record, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition">
                  <div>
                    <p className="font-medium">{record.game}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{record.score}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-3">
          <Button asChild variant="default">
            <a href="/jogos">Voltar aos Jogos</a>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            Sair da Conta
          </Button>
        </div>
      </div>
    </main>
  );
}
