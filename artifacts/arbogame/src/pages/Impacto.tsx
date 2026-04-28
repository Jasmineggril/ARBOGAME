import { useListEvents } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Calendar, MapPin } from "lucide-react";
import { objectUrl } from "@/lib/api-base";

const KIND_LABELS: Record<string, string> = {
  oficina: "Oficina",
  apresentacao: "Apresentação",
  acao_social: "Ação social",
  evento_academico: "Evento acadêmico",
};

export default function Impacto() {
  const { data: events = [], isLoading } = useListEvents();

  const socialEvents = events.filter((e) => e.kind === "oficina" || e.kind === "acao_social");

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="PIBEX · Extensão"
        title="Impacto Social"
        description="Levamos o Arbogame para escolas, comunidades e ações de mobilização. Aqui estão as oficinas e ações sociais realizadas pela equipe."
      />

      {isLoading ? (
        <div className="mt-12 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : socialEvents.length === 0 ? (
        <Card className="mt-12 border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            Nenhuma ação social ou oficina cadastrada ainda.
          </CardContent>
        </Card>
      ) : (
        <ol className="mt-12 space-y-4 border-l-2 border-primary/20 pl-6">
          {socialEvents.map((ev) => {
            const img = objectUrl(ev.imageUrl);
            return (
              <li key={ev.id} className="relative">
                <span className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                <Card className="border-card-border hover-elevate">
                  <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{KIND_LABELS[ev.kind] ?? ev.kind}</Badge>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(ev.eventDate).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold">{ev.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ev.description}</p>
                    </div>
                    {img ? (
                      <div className="h-28 w-full overflow-hidden rounded-lg md:h-full md:w-44">
                        <img src={img} alt={ev.title} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
