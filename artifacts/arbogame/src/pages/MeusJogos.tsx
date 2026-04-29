import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { supabase } from "@/lib/api-base";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";

interface Game {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link: string;
  categoria: string;
  curtidas: number;
  visualizacoes: number;
  created_at: string;
}

export default function MeusJogos() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se não logado
  if (!user) {
    setLocation("/");
    return null;
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("games")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        setGames(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar jogos");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user.id]);

  const handleDelete = async (gameId: string) => {
    if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("games")
        .delete()
        .eq("id", gameId)
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setGames(games.filter((g) => g.id !== gameId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar jogo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🎮 Meus Jogos</h1>
          <p className="text-foreground/60">
            {games.length === 0
              ? "Você ainda não criou nenhum jogo"
              : `Você tem ${games.length} jogo${games.length !== 1 ? "s" : ""} criado${games.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Carregando jogos...</p>
          </div>
        ) : games.length === 0 ? (
          <Card className="p-8 text-center border border-primary/20">
            <p className="text-foreground/60 mb-4">Nenhum jogo criado ainda</p>
            <Button onClick={() => setLocation("/criar-jogo")} className="gap-2">
              ✨ Criar Primeiro Jogo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="overflow-hidden border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                {/* Imagem */}
                <div className="relative w-full h-40 bg-gradient-to-br from-primary/10 to-purple/10 overflow-hidden">
                  <img
                    src={game.imagem_url}
                    alt={game.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg line-clamp-1">{game.titulo}</h3>
                    <p className="text-xs text-foreground/50 mt-1">{game.categoria}</p>
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
                    {game.descricao}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs mb-4 p-2 bg-background/50 rounded">
                    <div>
                      <p className="text-foreground/50">Curtidas</p>
                      <p className="font-bold">{game.curtidas}</p>
                    </div>
                    <div>
                      <p className="text-foreground/50">Visualizações</p>
                      <p className="font-bold">{game.visualizacoes}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="flex-1"
                    >
                      <a href={game.link} target="_blank" rel="noopener noreferrer">
                        Jogar
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3"
                      disabled
                      title="Em desenvolvimento"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-3"
                      onClick={() => handleDelete(game.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
