# 🚀 Setup ARBOGAME no Replit - Guia Completo

## O Que É

O **Replit** é onde seu ARBOGAME está sendo hospedado e rodando. Quando você fizer alterações e fizer push para o GitHub, o Replit automaticamente:
1. Puxa as mudanças
2. Roda `pnpm run build`
3. Inicia seu frontend no Vite
4. Expõe na URL: `https://arbogame-replit-url.replit.dev`

## ⚙️ Configuração do .replit

O arquivo `.replit` foi atualizado com:

```toml
[[ports]]
localPort = 5173        # Porta local da aplicação Vite
externalPort = 80       # Exposta do lado do Replit (HTTP)

[[ports]]
localPort = 5174        # API Mock (se precisar)
externalPort = 3000

[[ports]]
localPort = 5432        # PostgreSQL local (opcional)
externalPort = 5432
```

## 🔧 Variáveis de Ambiente no Replit

Para o ARBOGAME funcionar 100%, você precisa:

### 1. Abrir o Replit Dashboard
- Vá para: https://replit.com
- Selecione seu projeto ARBOGAME

### 2. Ir em Settings → Environment variables

### 3. Adicionar 2 Variáveis:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima
```

**Onde pegar essas valores:**
- Acesse: https://supabase.com/dashboard
- Selecione projeto: honcvotcxibuezaabybl
- Vá em: Settings → API
- Copie "Project URL" → `VITE_SUPABASE_URL`
- Copie "anon public" → `VITE_SUPABASE_ANON_KEY`

### 4. Salvar Variáveis

Depois salva, Replit recompila automaticamente! ✨

## 🏃 Como Rodar Localmente (Dev)

Se estiver testando localmente na máquina:

```bash
# 1. Instale dependências
pnpm install

# 2. Configure .env.local
# Copie .env.example em artifacts/arbogame/.env.example
# Preencha com os valores do Supabase

# 3. Rode o dev server
cd artifacts/arbogame
pnpm dev

# 4. Acesse
# http://localhost:5173
```

## 📋 Checklist Antes de Fazer Push

Antes de fazer `git push origin main`, verifique:

- ✅ SQL foi executado em Supabase? (tabelas criadas)
- ✅ `.env.local` está preenchido localmente?
- ✅ `pnpm dev` funciona em localhost:5173?
- ✅ Variáveis de ambiente estão no Replit Settings?
- ✅ Build não tem erros? (`pnpm run build`)

## 🔍 Monitorar Deploy no Replit

1. Abra https://replit.com/seu-projeto
2. Clique em "Run" ou `Ctrl+Enter`
3. Aguarde build (2-5 minutos primeira vez)
4. Veja URL em `Webview` → `Open in new tab`

## 🐛 Troubleshooting

### "Supabase connection failed"
- Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` foram salvas no Replit?
- Reinicie o container (Run → Stop → Run)

### "Build failed"
- Verifique stderr/stdout do Replit
- Rode localmente `pnpm run build` para debug
- Comando: `pnpm --filter @workspace/arbogame run build`

### "Port 5173 not accessible"
- Verifique `.replit` tem `localPort = 5173, externalPort = 80`
- Reinicie o container

## 📊 Diferenças: Replit vs Vercel vs Local

| Ambiente | URL | Auto-deploy | CI/CD | Dados |
|----------|-----|------------|-------|-------|
| **Local** | localhost:5173 | ❌ Manual | ❌ | Supabase remoto |
| **Replit** | replit.dev | ✅ Git push | ✅ Básico | Supabase remoto |
| **Vercel** | vercel.app | ✅ Git push | ✅ Avançado | Supabase remoto |

## 🎯 Fluxo Completo

1. **Desenvolvimento Local**
   ```bash
   pnpm dev              # localhost:5173
   ```

2. **Testar Build**
   ```bash
   pnpm run build        # Deve compilar sem erros
   ```

3. **Push para GitHub**
   ```bash
   git add -A
   git commit -m "feat: novo feature"
   git push origin main
   ```

4. **Replit Redeploys Automaticamente**
   - Puxa código do GitHub
   - Roda build
   - Inicia frontend
   - Disponível em replit.dev em ~3 minutos

5. **Ambiente de Produção (Vercel)**
   - Mesmo fluxo, com mais recursos
   - Disponível em arbogame.vercel.app

## ⚡ Quick Commands

```bash
# Rebuild local
pnpm run build

# Type check
pnpm run typecheck

# Dev frontend
cd artifacts/arbogame && pnpm dev

# Dev API (mock)
pnpm --filter @workspace/api-server run mock

# Clean
pnpm store prune
```

## 📝 Notas Importantes

- **Replit é FREE** - ótimo para hospedar seu projeto
- **Supabase é onde os dados reais ficam** - não fica no Replit
- **Variáveis de ambiente** devem ser preenchidas (não hardcode!)
- **Build deve passar localmente** antes de fazer push
- **Primeira execução pode demorar** 5-10 minutos (normal!)

---

**Tudo está configurado! Basta:**
1. Preencher as 2 variáveis de ambiente no Replit
2. Fazer `git push origin main`
3. Esperar build terminar
4. Site estará live em `seu-replit-url.replit.dev` 🚀
