import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListGames,
  useCreateGame,
  useDeleteGame,
  getListGamesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { FileUploadField } from "./FileUploadField";
import { useToast } from "@/hooks/use-toast";

export function GamesAdmin() {
  const queryClient = useQueryClient();
  const { data: games = [] } = useListGames();
  const createGame = useCreateGame();
  const deleteGame = useDeleteGame();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<"virtual" | "board" | "hybrid">("virtual");
  const [playUrl, setPlayUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tagsRaw, setTagsRaw] = useState("");

  function reset() {
    setTitle(""); setDescription(""); setKind("virtual");
    setPlayUrl(""); setImageUrl(null); setTagsRaw("");
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await createGame.mutateAsync({
        data: {
          title,
          description,
          kind,
          playUrl: playUrl.trim() || null,
          imageUrl: imageUrl ?? null,
          tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
        },
      });
      await queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
      toast({ title: "Jogo criado" });
      reset();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Excluir este jogo?")) return;
    await deleteGame.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
    toast({ title: "Jogo excluído" });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-bold">Adicionar jogo</p>
          <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="board">Tabuleiro</SelectItem>
                  <SelectItem value="hybrid">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="play">Link para jogar (opcional)</Label>
              <Input id="play" type="url" value={playUrl} onChange={(e) => setPlayUrl(e.target.value)} placeholder="https://..." />
            </div>
            <FileUploadField
              label="Imagem (opcional)"
              accept="image/*"
              value={imageUrl}
              onChange={setImageUrl}
            />
            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input id="tags" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="dengue, prevenção" />
            </div>
            <Button type="submit" disabled={createGame.isPending}>
              {createGame.isPending ? "Salvando..." : "Adicionar jogo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-bold">Jogos cadastrados ({games.length})</p>
        {games.map((g) => (
          <Card key={g.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">{g.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{g.kind}</Badge>
                  {g.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{g.description}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(g.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
