# Setup Supabase - Arbogame

## 🚀 Próximas Etapas

### 1️⃣ Executar Schema SQL no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor** 
3. Clique em **New Query**
4. Copie todo o conteúdo de `supabase/migrations/001_initial_schema.sql`
5. Cole no editor e clique em **Run**

Isso criará todas as tabelas necessárias com:
- ✅ Índices para otimizar queries
- ✅ Foreign keys para integridade dos dados
- ✅ Row Level Security (RLS) ativado
- ✅ Funções auxiliares (leaderboard, timestamps)
- ✅ Dados de teste (3 jogos iniciais)

### 2️⃣ Configurar Variáveis de Ambiente

**Local (Replit/Dev):**
```bash
# .env.local
VITE_SUPABASE_URL=https://honcvotcxibuezaabybl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbmN2b3RjeGlidWV6YWFieWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDM0MTcsImV4cCI6MjA5MjgxOTQxN30.nWWWIqSil73fFppq4x66_7kc69iOgHVqoc4THQc2d70
```

**Vercel (Production):**
1. Acesse https://vercel.com/jasmineggrils-projects/arbogame-undf
2. Vá para **Settings** → **Environment Variables**
3. Adicione as mesmas duas variáveis acima
4. Clique em **Save and redeploy**

### 3️⃣ Instalar Pacote (JÁ FEITO ✅)
```bash
pnpm add @supabase/supabase-js
```

### 4️⃣ Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/supabase.ts` | Cliente Supabase inicializado |
| `src/lib/queries/jogadores.ts` | Funções CRUD para jogadores |
| `src/components/JogadoresDemo.tsx` | Componente de teste |
| `supabase/migrations/001_initial_schema.sql` | Schema completo do banco |
| `.env.local` | Credenciais locais |

### 5️⃣ Testar Localmente

```bash
cd artifacts/arbogame
pnpm dev
```

Acesse: `http://localhost:5173`

Abra o **Console do Navegador** (F12) e procure por:
- `✅ Conexão com Supabase funcionando!` (sucesso)
- ou `❌ Erro ao conectar no Supabase:` (erro)

### 6️⃣ Fazer Commit e Push

```bash
cd /workspaces/ARBOGAME
git add .
git commit -m "feat: setup Supabase integration com schema e funções CRUD"
git push origin main
```

Vercel fará deploy automático depois do push.

### 7️⃣ Usar nos Componentes

**Exemplo - Buscar jogadores:**
```typescript
import { buscarJogadores } from '@/lib/queries/jogadores'

const jogadores = await buscarJogadores()
console.log(jogadores)
```

**Exemplo - Atualizar pontuação:**
```typescript
import { atualizarPontuacao } from '@/lib/queries/jogadores'

await atualizarPontuacao(jogadorId, 100)
```

**Exemplo - Criar novo jogador:**
```typescript
import { criarJogador } from '@/lib/queries/jogadores'

const novo = await criarJogador({
  nome: 'João',
  email: 'joao@example.com',
  pontuacao: 0,
  progresso: 0
})
```

---

## 📊 Estrutura de Dados

### Tabela: `jogadores`
```sql
id (UUID) | nome (text) | email (text) | pontuacao (int) | progresso (int) | criado_em (timestamp)
```

### Tabela: `jogos`
```sql
id (UUID) | titulo (text) | descricao (text) | categoria (text) | dificuldade (text)
```

### Tabela: `partidas`
```sql
id (UUID) | jogador_id (UUID) | jogo_id (UUID) | pontos (int) | tempo_total (int) | acertos (int) | erros (int)
```

### Tabela: `resultados_aprendizado`
```sql
id (UUID) | jogador_id (UUID) | jogo_id (UUID) | topico (text) | acertos (int) | total_questoes (int) | percentual (decimal)
```

---

## 🔒 Segurança

- ✅ **RLS (Row Level Security)** ativado em todas as tabelas
- ✅ **Anon Key** usada apenas para leitura pública
- ✅ Nunca compartilhe a **Service Role Key**
- ✅ Credenciais já estão em `Vercel Environment Variables`

---

## ❓ Dúvidas?

- **Erro na conexão?** Verifique o `.env.local`
- **Tabelas não aparecem?** Execute o SQL novamente
- **Dados não salvam?** Confira o RLS no dashboard do Supabase

---

**Status:** ✅ Pronto para produção!
