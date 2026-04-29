import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { GamesGrid } from "@/components/GamesGrid";
import { supabase } from "@/lib/api-base";

interface Game {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link: string;
  categoria: string;
  curtidas: number;
  visualizacoes: number;
  user_id: string;
  profiles: {
    nome: string;
    avatar_url: string;
  };
}

export default function JogosApp() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("games")
          .select(`
            id,
            titulo,
            descricao,
            imagem_url,
            link,
            categoria,
            curtidas,
            visualizacoes,
            user_id,
            profiles:user_id(nome, avatar_url)
          `)
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🎮 Jogos da Comunidade</h1>
            <p className="text-foreground/60">
              Descubra os melhores jogos criados pela comunidade Arbogame
            </p>
          </div>
          {user && (
            <Button onClick={() => setLocation("/criar-jogo")} className="gap-2 w-fit">
              ✨ Criar Jogo
            </Button>
          )}
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
            {user ? (
              <Button onClick={() => setLocation("/criar-jogo")} className="gap-2">
                ✨ Seja o Primeiro a Criar
              </Button>
            ) : (
              <p className="text-sm text-foreground/50">
                Faça login para criar seu jogo
              </p>
            )}
          </Card>
        ) : (
          <GamesGrid games={games} />
        )}
      </div>
    </div>
  );
}
