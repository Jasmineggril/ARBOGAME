import { Leaderboard } from "@/components/Leaderboard";

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2">🏆 Ranking de Jogadores</h1>
          <p className="text-foreground/60 text-lg">
            Veja os melhores guerreiros contra a dengue e mestres lúdicos
          </p>
        </div>
        <Leaderboard />
      </div>
    </div>
  );
}
