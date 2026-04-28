import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useListResults, useGetStatsOverview } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Microscope } from "lucide-react";

export default function Resultados() {
  const { data: results = [], isLoading } = useListResults();
  const { data: stats } = useGetStatsOverview();
  const resultsArray = Array.isArray(results) ? results : [];

  const chartData = useMemo(
    () =>
      resultsArray.map((r) => ({
        name: r.title.length > 22 ? r.title.slice(0, 22) + "…" : r.title,
        Participantes: r.participants,
        Satisfação: r.satisfactionScore ?? 0,
        Aprendizagem: r.learningScore ?? 0,
      })),
    [resultsArray],
  );

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Resultados Científicos"
        title="O que mostramos: que funciona."
        description="Cada aplicação dos jogos Arbogame é mensurada com instrumentos validados. Aqui você encontra números, satisfação, aprendizado e a metodologia de cada estudo."
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Participantes totais</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalParticipants ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Estudos realizados</p>
            <p className="mt-2 text-3xl font-bold">{resultsArray.length}</p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Satisfação média</p>
            <p className="mt-2 text-3xl font-bold">
              {stats?.avgSatisfaction != null ? stats.avgSatisfaction.toFixed(1) : "—"}{" "}
              <span className="text-base font-normal text-muted-foreground">/ 5</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 ? (
        <Card className="mt-8 border-card-border">
          <CardContent className="p-6">
            <p className="mb-4 text-sm font-semibold">Comparativo por estudo</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Participantes" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Satisfação" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Aprendizagem" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Estudos</h2>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : resultsArray.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <Microscope className="h-10 w-10 text-muted-foreground" />
              <p className="text-base font-medium">Nenhum estudo publicado ainda.</p>
            </CardContent>
          </Card>
        ) : (
          resultsArray.map((r) => (
            <Card key={r.id} className="border-card-border">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                    Metodologia
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.methodology}</p>
                </div>
                <div className="flex flex-col gap-3 rounded-xl bg-muted/40 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Participantes</p>
                    <p className="text-2xl font-bold">{r.participants}</p>
                  </div>
                  {r.satisfactionScore != null ? (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Satisfação</p>
                      <p className="text-2xl font-bold">{r.satisfactionScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 5</span></p>
                    </div>
                  ) : null}
                  {r.learningScore != null ? (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Aprendizagem</p>
                      <p className="text-2xl font-bold">{r.learningScore.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">/ 5</span></p>
                    </div>
                  ) : null}
                  <Badge variant="outline" className="self-start text-xs">
                    {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
