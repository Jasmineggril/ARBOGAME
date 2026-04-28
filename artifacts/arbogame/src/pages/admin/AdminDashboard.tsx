import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminLogout,
  useGetRecentActivity,
  getGetAuthStatusQueryKey,
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { GamesAdmin } from "./GamesAdmin";
import { EventsAdmin } from "./EventsAdmin";
import { ResultsAdmin } from "./ResultsAdmin";
import { DocumentsAdmin } from "./DocumentsAdmin";
import { TeamAdmin } from "./TeamAdmin";

const ACTIVITY_LABELS: Record<string, string> = {
  game: "Jogo",
  event: "Evento",
  result: "Resultado",
  document: "Documento",
};

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const logout = useAdminLogout();
  const { data: activity = [] } = useGetRecentActivity();

  async function onLogout() {
    await logout.mutateAsync();
    await queryClient.invalidateQueries({ queryKey: getGetAuthStatusQueryKey() });
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Painel administrativo</p>
          <h1 className="mt-1 text-3xl font-bold">Gestão do Arbogame</h1>
        </div>
        <Button variant="outline" onClick={onLogout} disabled={logout.isPending}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Tabs defaultValue="games">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="games">Jogos</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>
          <TabsContent value="games" className="mt-6"><GamesAdmin /></TabsContent>
          <TabsContent value="events" className="mt-6"><EventsAdmin /></TabsContent>
          <TabsContent value="results" className="mt-6"><ResultsAdmin /></TabsContent>
          <TabsContent value="documents" className="mt-6"><DocumentsAdmin /></TabsContent>
          <TabsContent value="team" className="mt-6"><TeamAdmin /></TabsContent>
        </Tabs>

        <Card className="h-fit border-card-border">
          <CardContent className="p-5">
            <p className="text-sm font-bold">Atividade recente</p>
            <div className="mt-3 space-y-3">
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma atividade ainda.</p>
              ) : (
                activity.slice(0, 8).map((a) => (
                  <div key={a.id} className="flex items-start gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {ACTIVITY_LABELS[a.kind] ?? a.kind}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.subtitle}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {new Date(a.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
