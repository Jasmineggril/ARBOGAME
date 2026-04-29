# 🚀 Configuração de Ambiente Vercel - ARBOGAME

## Variáveis de Ambiente Necessárias

Para que o ARBOGAME funcione 100% após o deploy no Vercel, você precisa configurar 2 variáveis de ambiente:

### 1. VITE_SUPABASE_URL
**O que é**: URL do seu projeto Supabase  
**Onde pegar**: 
- Acesse https://supabase.com/dashboard
- Selecione seu projeto (ARBOGAME)
- Vá em Settings → API
- Copie o valor de "Project URL"

**Exemplo**: `https://honcvotcxibuezaabybl.supabase.co`

### 2. VITE_SUPABASE_ANON_KEY
**O que é**: Chave anônima (pública) para acesso ao Supabase  
**Onde pegar**:
- Mesmo lugar: Settings → API
- Copie o valor de "anon public"

**Exemplo**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Como Configurar no Vercel

### Opção 1: Via Dashboard Web (Recomendado)
1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto ARBOGAME
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Para cada variável:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Cole o valor do Supabase
   - **Select Environment**: Production, Preview, Development
6. Clique **Save**
7. Repita para `VITE_SUPABASE_ANON_KEY`

### Opção 2: Via Vercel CLI
```bash
# Instale Vercel CLI (se não tiver)
npm i -g vercel

# Faça login
vercel login

# Acesse seu projeto
cd /workspaces/ARBOGAME

# Configure as variáveis
vercel env add VITE_SUPABASE_URL
# Cole: https://seu-projeto.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Cole: sua-chave-anonima
```

## Após Configurar as Variáveis

1. **Trigger novo deploy** (se não fez recentemente):
   - Git push automático: `git push origin main`
   - Ou manual no Vercel Dashboard: Deployments → Redeploy

2. **Aguarde o build** (~2-3 minutos)

3. **Teste o site**:
   - Acesse https://arbogame.vercel.app
   - Tente fazer signup
   - Verifique se o ranking foi carregado

## Checklist ANTES de Configurar Variáveis

- ✅ SQL executado em Supabase (tabelas criadas)?
- ✅ Projeto Supabase está ativo?
- ✅ `.env.local` do projeto está preenchido localmente?
- ✅ `pnpm dev` funciona em localhost com dados reais?

## Troubleshooting

### "Variáveis de ambiente não estão funcionando"
- Você salvou as variáveis no Vercel?
- Você fez um novo deployment após adicionar variáveis?
- Vercel leva ~30 segundos para sincronizar ambiente

### "Supabase connection failed"
- As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas?
- Supabase está online? (https://status.supabase.com)
- SQL foi executado? (Tabelas existem em https://supabase.com/dashboard)

### "Build falhou"
- Verifique logs: Vercel Dashboard → Deployments → Failed build
- Erro típico: pnpm install falhando → instale `pnpm@latest`
- TypeScript error: `pnpm typecheck` localmente para debug

## Variáveis Ocultas (Não Configure Aqui)

Essas variáveis podem estar num `.env.local` local (não em produção):
- `VITE_SUPABASE_URL` - já configurada acima ✅
- `VITE_SUPABASE_ANON_KEY` - já configurada acima ✅

## Depois que Estiver Live

Seu ARBOGAME estará funcionando com:
- ✅ Autenticação real via Supabase Auth
- ✅ Database conectado (profiles, games, badges, leaderboard)
- ✅ Ranking ao vivo 🏆
- ✅ Curtidas em tempo real ❤️
- ✅ Criação de jogos pela comunidade
- ✅ Mobile responsive
- ✅ Deploy automático a cada git push

---

**Tempo estimado**: 5 minutos para configurar + 3 minutos para novo deploy = **Pronto em 8 minutos!** 🚀
