import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/api-base";
import { ArrowLeft } from "lucide-react";

interface GameData {
  titulo: string;
  descricao: string;
  categoria: string;
  link: string;
  imagem_url: string;
}

export default function CriarJogo() {
  const { user, profile } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<GameData>({
    titulo: "",
    descricao: "",
    categoria: "interativo",
    link: "",
    imagem_url: "",
  });

  // Redirecionar se não logado
  if (!user) {
    setLocation("/");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from("games")
        .insert([
          {
            titulo: formData.titulo,
            descricao: formData.descricao,
            categoria: formData.categoria,
            link: formData.link,
            imagem_url: formData.imagem_url,
            user_id: user.id,
            curtidas: 0,
            visualizacoes: 0,
          },
        ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // Sucesso - volta para dashboard
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar jogo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <Card className="p-8 border border-primary/20">
          <h1 className="text-3xl font-bold mb-2">🎮 Criar Novo Jogo</h1>
          <p className="text-foreground/60 mb-8">
            Compartilhe seu jogo com a comunidade Arbogame
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-2">Título do Jogo *</label>
              <Input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ex: Dengue Quest"
                required
                className="bg-background/50"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva seu jogo, objetivos e mecânica"
                required
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-background/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium mb-2">Categoria *</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-background/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="interativo">🎮 Interativo</option>
                <option value="educativo">📚 Educativo</option>
                <option value="quiz">❓ Quiz</option>
                <option value="rpg">⚔️ RPG</option>
                <option value="estrategia">♟️ Estratégia</option>
                <option value="outro">🎯 Outro</option>
              </select>
            </div>

            {/* Link do Jogo */}
            <div>
              <label className="block text-sm font-medium mb-2">Link do Jogo *</label>
              <Input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://seu-jogo.com"
                required
                className="bg-background/50"
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-medium mb-2">URL da Imagem de Capa *</label>
              <Input
                type="url"
                name="imagem_url"
                value={formData.imagem_url}
                onChange={handleChange}
                placeholder="https://seu-site.com/imagem.jpg"
                required
                className="bg-background/50"
              />
              {formData.imagem_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-primary/20">
                  <img
                    src={formData.imagem_url}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={() => setError("Erro ao carregar imagem")}
                  />
                </div>
              )}
            </div>

            {/* Erro */}
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Criando..." : "✨ Criar Jogo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
