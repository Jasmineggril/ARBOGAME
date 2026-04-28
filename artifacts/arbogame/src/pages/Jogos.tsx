import { ExternalLink, Gamepad2 } from "lucide-react";
import { useListGames } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { objectUrl } from "@/lib/api-base";

const KIND_LABELS: Record<string, string> = {
  virtual: "Virtual",
  board: "Tabuleiro",
  hybrid: "Híbrido",
};

export default function Jogos() {
  const { data: games = [], isLoading } = useListGames();
  const gamesArray = Array.isArray(games) ? games : [];

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Catálogo"
        title="Jogos do Arbogame"
        description="Jogos educativos desenvolvidos e aplicados pela equipe Arbogame para a conscientização sobre dengue, zika e chikungunya."
      />

      {isLoading ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : gamesArray.length === 0 ? (
        <Card className="mt-12 border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Gamepad2 className="h-10 w-10 text-muted-foreground" />
            <p className="text-base font-medium">Nenhum jogo cadastrado ainda.</p>
            <p className="text-sm text-muted-foreground">Volte em breve para conferir os lançamentos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gamesArray.map((game) => {
            const img = objectUrl(game.imageUrl);
            return (
              <Card key={game.id} className="flex flex-col overflow-hidden border-card-border hover-elevate">
                {img ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img src={img} alt={game.title} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15">
                    <Gamepad2 className="h-12 w-12 text-primary/60" />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{KIND_LABELS[game.kind] ?? game.kind}</Badge>
                    {game.tags?.slice(0, 2).map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{game.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{game.description}</p>
                  {game.playUrl ? (
                    <Button asChild className="self-start gap-2">
                      <a href={game.playUrl} target="_blank" rel="noreferrer">
                        Jogar <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="outline" className="self-start text-xs">
                      Em breve
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
