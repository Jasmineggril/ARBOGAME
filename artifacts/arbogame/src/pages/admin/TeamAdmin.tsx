import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTeam,
  useCreateTeamMember,
  useDeleteTeamMember,
  getListTeamQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { FileUploadField } from "./FileUploadField";
import { useToast } from "@/hooks/use-toast";

export function TeamAdmin() {
  const queryClient = useQueryClient();
  const { data: team = [] } = useListTeam();
  const createMember = useCreateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [course, setCourse] = useState("");
  const [program, setProgram] = useState<"pibex" | "pic" | "ambos" | "orientador">("ambos");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState(99);

  function reset() {
    setName(""); setRole(""); setCourse(""); setProgram("ambos"); setBio(""); setPhotoUrl(null); setSortOrder(99);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await createMember.mutateAsync({
        data: { name, role, course, program, bio: bio || null, photoUrl: photoUrl ?? null, sortOrder },
      });
      await queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() });
      toast({ title: "Membro adicionado" });
      reset();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Remover este membro?")) return;
    await deleteMember.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-bold">Adicionar membro</p>
          <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div><Label>Função</Label><Input value={role} onChange={(e) => setRole(e.target.value)} required placeholder="Pesquisador, Bolsista..." /></div>
            <div><Label>Curso</Label><Input value={course} onChange={(e) => setCourse(e.target.value)} required placeholder="Medicina · UnDF" /></div>
            <div>
              <Label>Programa</Label>
              <Select value={program} onValueChange={(v) => setProgram(v as typeof program)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="orientador">Orientador</SelectItem>
                  <SelectItem value="pibex">PIBEX</SelectItem>
                  <SelectItem value="pic">PIC</SelectItem>
                  <SelectItem value="ambos">PIBEX + PIC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Bio (opcional)</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
            <FileUploadField label="Foto (opcional)" accept="image/*" value={photoUrl} onChange={setPhotoUrl} />
            <div><Label>Ordem</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
            <Button type="submit" disabled={createMember.isPending}>
              {createMember.isPending ? "Salvando..." : "Adicionar membro"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-bold">Equipe ({team.length})</p>
        {team.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">{m.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{m.program}</Badge>
                  <Badge variant="outline" className="text-xs">{m.role}</Badge>
                  <Badge variant="outline" className="text-xs">{m.course}</Badge>
                </div>
                {m.bio ? <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{m.bio}</p> : null}
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(m.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
