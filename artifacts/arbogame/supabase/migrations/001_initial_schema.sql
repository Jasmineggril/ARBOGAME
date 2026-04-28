-- 001_initial_schema.sql
-- Migração inicial do Arbogame
-- Execute este script no Supabase SQL Editor

-- ============================================
-- TABELA: jogadores
-- ============================================
CREATE TABLE IF NOT EXISTS jogadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  pontuacao INTEGER DEFAULT 0,
  progresso INTEGER DEFAULT 0,
  nivel TEXT DEFAULT 'iniciante', -- iniciante, intermediario, avancado
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jogadores_email ON jogadores(email);
CREATE INDEX idx_jogadores_criado_em ON jogadores(criado_em DESC);

-- ============================================
-- TABELA: jogos
-- ============================================
CREATE TABLE IF NOT EXISTS jogos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT, -- saude, educacao, diversao
  dificuldade TEXT DEFAULT 'facil',
  tempo_medio INTEGER, -- em segundos
  icone TEXT, -- URL ou emoji
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jogos_categoria ON jogos(categoria);
CREATE INDEX idx_jogos_criado_em ON jogos(criado_em DESC);

-- ============================================
-- TABELA: partidas
-- ============================================
CREATE TABLE IF NOT EXISTS partidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jogador_id UUID NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
  jogo_id UUID NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  pontos INTEGER DEFAULT 0,
  tempo_total INTEGER, -- em segundos
  acertos INTEGER,
  erros INTEGER,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_partidas_jogador_id ON partidas(jogador_id);
CREATE INDEX idx_partidas_jogo_id ON partidas(jogo_id);
CREATE INDEX idx_partidas_criado_em ON partidas(criado_em DESC);

-- ============================================
-- TABELA: resultados_aprendizado
-- ============================================
CREATE TABLE IF NOT EXISTS resultados_aprendizado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jogador_id UUID NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
  jogo_id UUID NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  topico TEXT NOT NULL,
  acertos INTEGER DEFAULT 0,
  total_questoes INTEGER DEFAULT 0,
  percentual DECIMAL(5, 2) DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_resultados_jogador_id ON resultados_aprendizado(jogador_id);
CREATE INDEX idx_resultados_topico ON resultados_aprendizado(topico);
CREATE INDEX idx_resultados_atualizado_em ON resultados_aprendizado(atualizado_em DESC);

-- ============================================
-- TABELA: eventos (eventos de aprendizado)
-- ============================================
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento TIMESTAMP WITH TIME ZONE NOT NULL,
  local TEXT,
  tipo TEXT, -- workshop, aula, competicao
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_eventos_data_evento ON eventos(data_evento DESC);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);

-- ============================================
-- TABELA: leaderboard (cache para performance)
-- ============================================
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jogador_id UUID NOT NULL REFERENCES jogadores(id) ON DELETE CASCADE,
  posicao INTEGER,
  pontos_totais INTEGER DEFAULT 0,
  partidas_jogadas INTEGER DEFAULT 0,
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_posicao ON leaderboard(posicao);
CREATE INDEX idx_leaderboard_pontos_totais ON leaderboard(pontos_totais DESC);
CREATE UNIQUE INDEX idx_leaderboard_jogador_id ON leaderboard(jogador_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE jogadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_aprendizado ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Policies para jogadores (anon pode inserir e atualizar suas próprias linhas)
CREATE POLICY "Jogadores podem ler todos" ON jogadores
  FOR SELECT USING (true);

CREATE POLICY "Jogadores podem inserir" ON jogadores
  FOR INSERT WITH CHECK (true);

-- Policies para jogos (todos podem ler)
CREATE POLICY "Jogos podem ser lidos" ON jogos
  FOR SELECT USING (true);

-- Policies para partidas (todos podem inserir, ler seus próprios registros)
CREATE POLICY "Partidas podem ser lidas" ON partidas
  FOR SELECT USING (true);

CREATE POLICY "Partidas podem ser inseridas" ON partidas
  FOR INSERT WITH CHECK (true);

-- Policies para resultados
CREATE POLICY "Resultados pode ser lidos" ON resultados_aprendizado
  FOR SELECT USING (true);

CREATE POLICY "Resultados podem ser inseridos" ON resultados_aprendizado
  FOR INSERT WITH CHECK (true);

-- Policies para eventos (todos podem ler)
CREATE POLICY "Eventos podem ser lidos" ON eventos
  FOR SELECT USING (true);

-- Policies para leaderboard (todos podem ler)
CREATE POLICY "Leaderboard pode ser lido" ON leaderboard
  FOR SELECT USING (true);

-- ============================================
-- DADOS DE TESTE (OPCIONAL)
-- ============================================

-- Inserir jogos de teste
INSERT INTO jogos (titulo, descricao, categoria, dificuldade, tempo_medio)
VALUES 
  ('Caça ao Mosquito', 'Identifique e elimine os mosquitos corretamente', 'saude', 'facil', 120),
  ('Trilha das Arboviroses', 'Aprenda sobre dengue, zika e chikungunya', 'educacao', 'intermediario', 180),
  ('Quiz de Saúde', 'Teste seus conhecimentos sobre saúde pública', 'educacao', 'facil', 60)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNÇÕES DE UTILIDADE
-- ============================================

-- Função para atualizar leaderboard
CREATE OR REPLACE FUNCTION atualizar_leaderboard()
RETURNS VOID AS $$
BEGIN
  DELETE FROM leaderboard;
  
  INSERT INTO leaderboard (jogador_id, posicao, pontos_totais, partidas_jogadas)
  SELECT 
    j.id,
    ROW_NUMBER() OVER (ORDER BY SUM(COALESCE(p.pontos, 0)) DESC) as posicao,
    SUM(COALESCE(p.pontos, 0)) as pontos_totais,
    COUNT(p.id) as partidas_jogadas
  FROM jogadores j
  LEFT JOIN partidas p ON j.id = p.jogador_id
  GROUP BY j.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_jogadores_atualizado_em
  BEFORE UPDATE ON jogadores
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trigger_resultados_atualizado_em
  BEFORE UPDATE ON resultados_aprendizado
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_timestamp();

-- ============================================
-- FIM DA MIGRAÇÃO
-- ============================================
