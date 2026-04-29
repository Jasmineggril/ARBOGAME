-- ============================================
-- SCHEMA COMPLETO ARBOGAME COM RANKING
-- Execute isto no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PERFIS (extend auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  escola TEXT, -- ex: "Escola Municipal X", "IFCE"
  pontos INTEGER DEFAULT 0,
  especialidade TEXT, -- "Matador de Dengue", "Maga do Conhecimento", "Mestre Lúdico", etc
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Index para performance
CREATE INDEX idx_profiles_pontos ON profiles(pontos DESC);
CREATE INDEX idx_profiles_escola ON profiles(escola);

-- ============================================
-- 2. BADGES/CONQUISTAS
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL, -- "Matador de Dengue", "Maga do Conhecimento", etc
  descricao TEXT,
  icone TEXT, -- emoji ou URL
  requisito_pontos INTEGER, -- pontos necessários
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir badges padrão
INSERT INTO badges (titulo, descricao, icone, requisito_pontos) VALUES
  ('Matador de Dengue 🦟', 'Eliminou 100 mosquitos', '🦟', 100),
  ('Maga do Conhecimento 🔮', 'Acertou 50 questões com perfeição', '🔮', 150),
  ('Mestre Lúdico 🎮', 'Criou 10 jogos educacionais', '🎮', 200),
  ('Iniciante 🌱', 'Primeiro passo no ARBOGAME', '🌱', 0),
  ('Comunidade 🤝', 'Recebeu 10 curtidas em seus projetos', '🤝', 50)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. RELAÇÃO: USUÁRIO <-> BADGES
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- 4. JOGOS/PROJETOS
-- ============================================
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT, -- "educacao", "saude", "diversao"
  link TEXT,
  imagem_url TEXT,
  arquivo_url TEXT, -- para upload de arquivo
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  curtidas INTEGER DEFAULT 0,
  visualizacoes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_created_at ON games(created_at DESC);
CREATE INDEX idx_games_curtidas ON games(curtidas DESC);

-- ============================================
-- 5. CURTIDAS
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Trigger para atualizar contagem de curtidas
CREATE OR REPLACE FUNCTION update_game_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE games SET curtidas = curtidas + 1 WHERE id = NEW.game_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE games SET curtidas = curtidas - 1 WHERE id = OLD.game_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_update_count AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_game_likes();

-- ============================================
-- 6. COMENTÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_game_id ON comments(game_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- 7. VISUALIZAÇÕES (para analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID, -- nullable se for anônimo
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_views_game_id ON views(game_id);
CREATE INDEX idx_views_created_at ON views(created_at DESC);

-- Trigger para atualizar visualizações
CREATE OR REPLACE FUNCTION increment_game_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games SET visualizacoes = visualizacoes + 1 WHERE id = NEW.game_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER views_increment AFTER INSERT ON views
  FOR EACH ROW EXECUTE FUNCTION increment_game_views();

-- ============================================
-- 8. LEADERBOARD (view para performance)
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.nome,
  p.escola,
  p.pontos,
  p.especialidade,
  p.avatar_url,
  (SELECT COUNT(*) FROM games WHERE user_id = p.id) as total_games,
  (SELECT COUNT(DISTINCT user_id) FROM likes WHERE game_id IN (SELECT id FROM games WHERE user_id = p.id)) as total_curtidas,
  ROW_NUMBER() OVER (ORDER BY p.pontos DESC) as posicao
FROM profiles p
WHERE p.nome IS NOT NULL
ORDER BY p.pontos DESC;

-- ============================================
-- 9. ROW LEVEL SECURITY (Segurança)
-- ============================================

-- Ativar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

-- Policies para Profiles
CREATE POLICY "Perfis são públicos" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies para Games
CREATE POLICY "Games são públicos" ON games
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar games" ON games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios games" ON games
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios games" ON games
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para Likes
CREATE POLICY "Likes são públicos" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem curtir" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover suas curtidas" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para Comments
CREATE POLICY "Comentários são públicos" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem comentar" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para Views
CREATE POLICY "Usuarios podem registrar visualizações" ON views
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 10. DADOS DE TESTE
-- ============================================

-- Nota: Para adicionar usuários de teste, use o Dashboard do Supabase
-- Na aba "Auth" → "Users" → "Add user"

-- Exemplo de profile (após criar user no Auth)
-- INSERT INTO profiles (id, nome, email, escola, pontos, especialidade, bio)
-- VALUES 
--   ('user-uuid-aqui', 'João Silva', 'joao@example.com', 'Escola Municipal X', 250, 'Matador de Dengue 🦟', 'Apaixonado por jogos educativos'),
--   ('user-uuid-aqui2', 'Maria Santos', 'maria@example.com', 'IFCE', 180, 'Maga do Conhecimento 🔮', 'Criadora de conteúdo');

-- ============================================
-- FIM DO SCHEMA
-- ============================================
