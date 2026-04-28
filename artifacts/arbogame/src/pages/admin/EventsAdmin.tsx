import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListEvents,
  useCreateEvent,
  useDeleteEvent,
  getListEventsQueryKey,
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

export function EventsAdmin() {
  const queryClient = useQueryClient();
  const { data: events = [] } = useListEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [kind, setKind] = useState<"oficina" | "apresentacao" | "acao_social" | "evento_academico">("oficina");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function reset() {
    setTitle(""); setDescription(""); setLocation(""); setEventDate("");
    setKind("oficina"); setImageUrl(null);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await createEvent.mutateAsync({
        data: { title, description, location, eventDate, kind, imageUrl: imageUrl ?? null },
      });
      await queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      toast({ title: "Evento criado" });
      reset();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Excluir este evento?")) return;
    await deleteEvent.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
    toast({ title: "Evento excluído" });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-bold">Adicionar evento</p>
          <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3">
            <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} /></div>
            <div><Label>Local</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} required /></div>
            <div><Label>Data</Label><Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required /></div>
            <div>
              <Label>Tipo</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="apresentacao">Apresentação</SelectItem>
                  <SelectItem value="acao_social">Ação social</SelectItem>
                  <SelectItem value="evento_academico">Evento acadêmico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FileUploadField label="Imagem (opcional)" accept="image/*" value={imageUrl} onChange={setImageUrl} />
            <Button type="submit" disabled={createEvent.isPending}>
              {createEvent.isPending ? "Salvando..." : "Adicionar evento"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-bold">Eventos cadastrados ({events.length})</p>
        {events.map((ev) => (
          <Card key={ev.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">{ev.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{ev.kind}</Badge>
                  <Badge variant="outline" className="text-xs">{new Date(ev.eventDate).toLocaleDateString("pt-BR")}</Badge>
                  <Badge variant="outline" className="text-xs">{ev.location}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{ev.description}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(ev.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
