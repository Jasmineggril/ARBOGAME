import { useListTeam } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/SectionHeader";
import { objectUrl } from "@/lib/api-base";

const PROGRAM_LABEL: Record<string, string> = {
  pibex: "PIBEX · Extensão",
  pic: "PIC · Pesquisa",
  ambos: "PIBEX + PIC",
  orientador: "Orientador",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Equipe() {
  const { data: team = [], isLoading } = useListTeam();
  const teamArray = Array.isArray(team) ? team : [];

  const orientador = teamArray.find((m) => m.program === "orientador");
  const others = teamArray.filter((m) => m.program !== "orientador");

  // Fallback static team data when API / DB is not available
  const fallbackTeam = [
    { id: "t-orientador", name: "Prof. Antonio Augusto", role: "Orientador", course: "UnDF", program: "orientador", photoUrl: null, bio: "Professor orientador do projeto Arbogame." },
    { id: "t-arthur", name: "Arthur Mendes Alcoforado", role: "Estudante", course: "Ciência da Computação", program: "pic", photoUrl: null },
    { id: "t-bruno", name: "Bruno Araújo Sales", role: "Estudante", course: "Engenharia de Software", program: "pibex", photoUrl: null },
    { id: "t-igor", name: "Igor Peres Raggi Lacerda", role: "Estudante", course: "Sistemas da Informação", program: "pic", photoUrl: null },
    { id: "t-jasmine", name: "Jasmine de Sá Araújo", role: "Estudante", course: "Engenharia de Software", program: "ambos", photoUrl: null },
    { id: "t-raissa", name: "Raíssa Carvalho", role: "Estudante", course: "Ciência da Computação", program: "ambos", photoUrl: null },
    { id: "t-vinicius", name: "Vinícius Xavier Alcântara", role: "Estudante", course: "Sistemas da Informação", program: "pibex", photoUrl: null },
  ];

  const hasTeamData = teamArray.length > 0;
  const effectiveTeam = hasTeamData ? teamArray : fallbackTeam;

  const effectiveOrientador = effectiveTeam.find((m) => m.program === "orientador");
  const effectiveOthers = effectiveTeam.filter((m) => m.program !== "orientador");

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Quem faz o Arbogame"
        title="Equipe"
        description="Estudantes de graduação da UnDF sob orientação do Prof. Antonio Augusto, atuando entre pesquisa científica e extensão."
      />

      {isLoading ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {effectiveOrientador ? (
            <Card className="mt-12 border-primary/40 bg-primary/5">
              <CardContent className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24 ring-2 ring-primary/30">
                  <AvatarImage src={objectUrl(effectiveOrientador.photoUrl)} alt={effectiveOrientador.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {initials(effectiveOrientador.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Badge className="mb-2 bg-primary text-primary-foreground">{PROGRAM_LABEL.orientador}</Badge>
                  <h2 className="text-2xl font-bold">{effectiveOrientador.name}</h2>
                  <p className="text-sm text-muted-foreground">{effectiveOrientador.role} · {effectiveOrientador.course}</p>
                  {effectiveOrientador.bio ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed">{effectiveOrientador.bio}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {effectiveOthers.map((m) => (
              <Card key={m.id} className="border-card-border hover-elevate">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={objectUrl(m.photoUrl)} alt={m.name} />
                      <AvatarFallback className="bg-muted text-base">{initials(m.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.course}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{m.role}</Badge>
                    <Badge variant="outline" className="text-xs">{PROGRAM_LABEL[m.program] ?? m.program}</Badge>
                  </div>
                  {m.bio ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
