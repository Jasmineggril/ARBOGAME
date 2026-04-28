import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListDocuments,
  useCreateDocument,
  useDeleteDocument,
  getListDocumentsQueryKey,
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

export function DocumentsAdmin() {
  const queryClient = useQueryClient();
  const { data: docs = [] } = useListDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"report" | "article" | "certificate" | "edital" | "other">("report");
  const [program, setProgram] = useState<"pibex" | "pic" | "geral">("geral");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function reset() {
    setTitle(""); setDescription(""); setCategory("report"); setProgram("geral"); setFileUrl(null);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!fileUrl) {
      toast({ title: "Envie um arquivo", variant: "destructive" });
      return;
    }
    try {
      await createDoc.mutateAsync({
        data: { title, description, category, program, fileUrl },
      });
      await queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
      toast({ title: "Documento criado" });
      reset();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Excluir este documento?")) return;
    await deleteDoc.mutateAsync({ id });
    await queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-bold">Adicionar documento</p>
          <form onSubmit={onCreate} className="mt-4 flex flex-col gap-3">
            <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report">Relatório</SelectItem>
                    <SelectItem value="article">Artigo</SelectItem>
                    <SelectItem value="certificate">Certificado</SelectItem>
                    <SelectItem value="edital">Edital</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Programa</Label>
                <Select value={program} onValueChange={(v) => setProgram(v as typeof program)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="pibex">PIBEX</SelectItem>
                    <SelectItem value="pic">PIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FileUploadField label="Arquivo (PDF, DOC, etc.)" accept=".pdf,.doc,.docx,application/pdf" value={fileUrl} onChange={setFileUrl} />
            <Button type="submit" disabled={createDoc.isPending}>
              {createDoc.isPending ? "Salvando..." : "Adicionar documento"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-bold">Documentos ({docs.length})</p>
        {docs.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold">{d.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">{d.category}</Badge>
                  <Badge variant="outline" className="text-xs">{d.program}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => onDelete(d.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
