import { Link } from "wouter";
import { useListEvents, useListDocuments, useListTeam } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Download, ArrowRight } from "lucide-react";
import { objectUrl } from "@/lib/api-base";

export default function Pibex() {
  const { data: events = [], isLoading: loadingEvents } = useListEvents();
  const { data: docs = [], isLoading: loadingDocs } = useListDocuments();
  const { data: team = [] } = useListTeam();

  const eventsArray = Array.isArray(events) ? events : [];
  const docsArray = Array.isArray(docs) ? docs : [];
  const teamArray = Array.isArray(team) ? team : [];

  const pibexDocs = docsArray.filter((d) => d.program === "pibex" || d.program === "geral");
  const pibexEvents = eventsArray.filter((e) => e.kind === "oficina" || e.kind === "acao_social");
  const pibexTeam = teamArray.filter((m) => m.program === "pibex" || m.program === "ambos");

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="PIBEX · Programa de Bolsas de Extensão"
        title="Estamos ajudando a sociedade."
        description="A frente de extensão do Arbogame leva os jogos educativos para escolas, comunidades e ações sociais — promovendo conscientização sobre arboviroses e fortalecendo a relação entre universidade e sociedade."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Ações de extensão</p>
            <p className="mt-2 text-3xl font-bold">{pibexEvents.length}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Equipe PIBEX</p>
            <p className="mt-2 text-3xl font-bold">{pibexTeam.length}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Documentos PIBEX</p>
            <p className="mt-2 text-3xl font-bold">{pibexDocs.length}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Ações realizadas</h2>
      {loadingEvents ? (
        <Skeleton className="mt-4 h-32 w-full rounded-xl" />
      ) : pibexEvents.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhuma ação cadastrada ainda.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {pibexEvents.map((ev) => (
            <Card key={ev.id} className="border-card-border">
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{ev.kind === "oficina" ? "Oficina" : "Ação social"}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(ev.eventDate).toLocaleDateString("pt-BR")}</span>
                </div>
                <p className="text-base font-bold">{ev.title}</p>
                <p className="text-xs text-muted-foreground">{ev.location}</p>
                <p className="text-sm text-muted-foreground">{ev.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Documentos</h2>
      {loadingDocs ? (
        <Skeleton className="mt-4 h-32 w-full rounded-xl" />
      ) : pibexDocs.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhum documento ainda. Os editais estão sendo digitalizados pela equipe.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {pibexDocs.map((d) => (
            <Card key={d.id} className="border-card-border">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{d.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.description}</p>
                </div>
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <a href={objectUrl(d.fileUrl) ?? "#"} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" /> Baixar
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/impacto">Ver impacto social <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/producao">Produção acadêmica</Link>
        </Button>
      </div>
    </div>
  );
}
