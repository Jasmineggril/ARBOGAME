import { Link } from "wouter";
import { useListResults, useListDocuments, useListTeam } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Download, ArrowRight } from "lucide-react";
import { objectUrl } from "@/lib/api-base";

export default function Pic() {
  const { data: results = [], isLoading: loadingResults } = useListResults();
  const { data: docs = [], isLoading: loadingDocs } = useListDocuments();
  const { data: team = [] } = useListTeam();

  const resultsArray = Array.isArray(results) ? results : [];
  const docsArray = Array.isArray(docs) ? docs : [];
  const teamArray = Array.isArray(team) ? team : [];

  const picDocs = docsArray.filter((d) => d.program === "pic" || d.program === "geral");
  const picTeam = teamArray.filter((m) => m.program === "pic" || m.program === "ambos");

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="PIC · Iniciação Científica"
        title="Estamos comprovando que funciona."
        description="A frente de pesquisa do Arbogame avalia cientificamente o uso dos jogos educativos. Coletamos dados, analisamos aprendizado e produzimos evidências sobre o impacto da gamificação na conscientização sobre arboviroses."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Estudos</p>
            <p className="mt-2 text-3xl font-bold">{results.length}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Equipe PIC</p>
            <p className="mt-2 text-3xl font-bold">{picTeam.length}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Documentos PIC</p>
            <p className="mt-2 text-3xl font-bold">{picDocs.length}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Estudos científicos</h2>
      {loadingResults ? (
        <Skeleton className="mt-4 h-32 w-full rounded-xl" />
      ) : resultsArray.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhum estudo cadastrado ainda.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {resultsArray.map((r) => (
            <Card key={r.id} className="border-card-border">
              <CardContent className="flex flex-col gap-2 p-5">
                <p className="text-base font-bold">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary">{r.participants} participantes</Badge>
                  {r.satisfactionScore != null ? (
                    <Badge variant="outline">Satisfação {r.satisfactionScore.toFixed(1)}/5</Badge>
                  ) : null}
                  {r.learningScore != null ? (
                    <Badge variant="outline">Aprendizagem {r.learningScore.toFixed(1)}/5</Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Documentos</h2>
      {loadingDocs ? (
        <Skeleton className="mt-4 h-32 w-full rounded-xl" />
      ) : picDocs.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhum documento publicado ainda.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {picDocs.map((d) => (
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
          <Link href="/resultados">Ver resultados completos <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/metodologia">Metodologia</Link>
        </Button>
      </div>
    </div>
  );
}
