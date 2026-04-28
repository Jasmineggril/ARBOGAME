import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListResults,
  useCreateResult,
  useDeleteResult,
  useListGames,
  getListResultsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ResultsAdmin() {
  const queryClient = useQueryClient();
  const { data: results = [] } = useListResults();
  const { data: games = [] } = useListGames();
  const createResult = useCreateResult();
  const deleteResult = useDeleteResult();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [participants, setParticipants] = useState(0);
  const [satisfaction, setSatisfaction] = useState("");
  const [learning, setLearning] = useState("");
  const [methodology, setMethodology] = useState("");
  const [gameId, setGameId] = useState<string>("none");

  function reset() {
    setTitle(""); setSummary(""); setParticipants(0); setSatisfaction("");
    setLearning(""); setMethodology(""); setGameId("none");
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await createResult.mutateAsync({
        data: {
          title,
          summary,
          participants,
          satisfactionScore: satisfaction ? Number(satisfaction) : null,
          learningScore: learning ? Number(learning) : null,
          methodology,
          gameId: gameId === "none" ? null : Number(gameId),
        },
      });
      await queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
      toast({ title: "Resultado criado" });
      reset();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Excluir este resultado?")) return;
    await deleteResult.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListResultsQueryKey() });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-bold">Adicionar resultado</p>
          <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3">
            <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><Label>Resumo</Label><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={3} /></div>
            <div><Label>Participantes</Label><Input type="number" min={0} value={participants} onChange={(e) => setParticipants(Number(e.target.value))} required /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Satisfação (0-5)</Label><Input type="number" step="0.1" min={0} max={5} value={satisfaction} onChange={(e) => setSatisfaction(e.target.value)} /></div>
              <div><Label>Aprendizagem (0-5)</Label><Input type="number" step="0.1" min={0} max={5} value={learning} onChange={(e) => setLearning(e.target.value)} /></div>
            </div>
            <div><Label>Metodologia</Label><Textarea value={methodology} onChange={(e) => setMethodology(e.target.value)} required rows={3} /></div>
            <div>
              <Label>Jogo associado (opcional)</Label>
              <Select value={gameId} onValueChange={setGameId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Nenhum —</SelectItem>
                  {games.map((g) => <SelectItem key={g.id} value={String(g.id)}>{g.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={createResult.isPending}>
              {createResult.isPending ? "Salvando..." : "Adicionar resultado"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-bold">Resultados ({results.length})</p>
        {results.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">{r.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{r.participants} participantes</Badge>
                  {r.satisfactionScore != null ? <Badge variant="outline" className="text-xs">Sat {r.satisfactionScore.toFixed(1)}</Badge> : null}
                  {r.learningScore != null ? <Badge variant="outline" className="text-xs">Apr {r.learningScore.toFixed(1)}</Badge> : null}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{r.summary}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
