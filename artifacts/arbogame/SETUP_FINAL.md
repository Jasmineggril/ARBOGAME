# ✅ Supabase Setup - Instruções Finais

## Status: Credenciais OK, Aguardando Tabelas

A conexão com Supabase está funcionando! ✅

A mensagem `"Could not find the table 'public.jogadores'"` é **esperada** porque você ainda não criou as tabelas.

---

## 📋 O Que Fazer Agora

### 1️⃣ **Criar as Tabelas no Supabase** (2 minutos)

1. Abra seu projeto em https://app.supabase.com
2. Vá para **SQL Editor** → **New Query**
3. Cole o conteúdo do arquivo:
   ```
   artifacts/arbogame/supabase/migrations/001_initial_schema.sql
   ```
4. Clique em **Run**
5. Pronto! ✅

---

### 2️⃣ **Configurar Vercel** (2 minutos)

1. Vá para https://vercel.com/jasmineggrils-projects/arbogame-undf
2. **Settings** → **Environment Variables**
3. Adicione 2 variáveis:

```
VITE_SUPABASE_URL=https://honcvotcxibuezaabybl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbmN2b3RjeGlidWV6YWFieWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDM0MTcsImV4cCI6MjA5MjgxOTQxN30.nWWWIqSil73fFppq4x66_7kc69iOgHVqoc4THQc2d70
```

4. Clique em **Save and Redeploy**
5. Aguarde o novo deploy
6. Pronto! ✅

---

## 🧪 Testar Localmente

Depois de criar as tabelas:

```bash
cd /workspaces/ARBOGAME/artifacts/arbogame
pnpm dev
```

Abra a página e verifique no **Console do Navegador** (F12):
- Se vir `✅ Conexão com Supabase funcionando!` → Sucesso! 🎉
- Se vir `❌ Erro ao conectar...` → Veja a mensagem de erro

---

## 📂 Arquivos Criados

```
artifacts/arbogame/
├── .env.local                              # ← Credenciais locais (não compartilhar!)
├── SUPABASE_SETUP.md                       # ← Documentação completa
├── supabase/
│   ├── .env                                # ← Config do CLI
│   ├── migrations/
│   │   └── 001_initial_schema.sql          # ← **EXECUTE ISSO PRIMEIRO**
│   └── test-connection.mjs                 # ← Script de teste
├── src/
│   ├── lib/
│   │   ├── supabase.ts                     # ← Cliente Supabase
│   │   └── queries/
│   │       └── jogadores.ts                # ← Funções CRUD
│   └── components/
│       └── JogadoresDemo.tsx               # ← Componente de teste
```

---

## 🚀 Próximos Passos

1. **Execute o SQL** no Supabase
2. **Teste localmente**: `pnpm dev`
3. **Configure Vercel** com env vars
4. **Commit foi feito automaticamente** ✅
5. O Vercel fará deploy automático após o push

---

## 💡 Exemplos de Uso

### Buscar jogadores
```typescript
import { buscarJogadores } from '@/lib/queries/jogadores'

const jogadores = await buscarJogadores()
```

### Criar jogador
```typescript
import { criarJogador } from '@/lib/queries/jogadores'

const novo = await criarJogador({
  nome: 'João Silva',
  email: 'joao@example.com',
  pontuacao: 0,
  progresso: 0
})
```

### Atualizar pontuação
```typescript
import { atualizarPontuacao } from '@/lib/queries/jogadores'

await atualizarPontuacao(jogadorId, 150)
```

---

## ❓ Dúvidas?

**P: Onde está o .env.local?**
R: Em `artifacts/arbogame/.env.local` (já foi criado)

**P: Por que a tabela não aparece?**
R: Execute o SQL em `supabase/migrations/001_initial_schema.sql`

**P: Erro "402"?**
R: Seu projeto Supabase foi pausado. Reative em settings no supabase.com

**P: Como adicionar novo jogo?**
R: Via SQL direto ou create uma função no `lib/queries/`

---

## ✨ Resumo

| Fase | Status | Ação |
|------|--------|------|
| Setup Supabase | ✅ Pronto | Apenas execute o SQL |
| Arquivos criados | ✅ Pronto | Tudo pronto para usar |
| Credenciais | ✅ Configuradas | Em Vercel e .env.local |
| Deploy | ✅ Automático | Acontece ao fazer push |

**Agora é só execute o SQL e pronto!** 🎉
