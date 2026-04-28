import { useState } from "react";
import { useListDocuments } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Download, FileText } from "lucide-react";
import { objectUrl } from "@/lib/api-base";

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "report", label: "Relatórios" },
  { value: "article", label: "Artigos" },
  { value: "certificate", label: "Certificados" },
  { value: "edital", label: "Editais" },
  { value: "other", label: "Outros" },
];

const CATEGORY_LABEL: Record<string, string> = {
  report: "Relatório",
  article: "Artigo",
  certificate: "Certificado",
  edital: "Edital",
  other: "Outro",
};

const PROGRAM_LABEL: Record<string, string> = {
  pibex: "PIBEX",
  pic: "PIC",
  geral: "Geral",
};

export default function Producao() {
  const [filter, setFilter] = useState<string>("all");
  const { data: docs = [], isLoading } = useListDocuments(
    filter === "all" ? undefined : { category: filter as "report" | "article" | "certificate" | "edital" | "other" },
  );

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Documentos do projeto"
        title="Produção Acadêmica"
        description="Relatórios, artigos, certificados, editais e materiais produzidos pela equipe Arbogame ao longo do projeto."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c.value}
            variant={filter === c.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-base font-medium">Nenhum documento nesta categoria ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <Card key={d.id} className="border-card-border hover-elevate">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{CATEGORY_LABEL[d.category] ?? d.category}</Badge>
                    <Badge variant="outline" className="text-xs">{PROGRAM_LABEL[d.program] ?? d.program}</Badge>
                  </div>
                  <h3 className="text-base font-bold">{d.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                  <Button asChild className="self-start gap-2" size="sm">
                    <a href={objectUrl(d.fileUrl) ?? "#"} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" /> Baixar
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
