# 🎮 ARBOGAME - Sistema de Ranking e Gamificação

Sistema educativo interativo com ranking em tempo real, badges, jogos da comunidade e gamificação completa.

**Status:** ✅ Produção-Ready | 🚀 Pronto para Deploy

---

## ⚡ Começar Rápido

### 1. Configurar Supabase (CRÍTICO!)

Execute o SQL nas tabelas:
- [📖 Veja FINAL_INSTRUCTIONS.md](FINAL_INSTRUCTIONS.md) (Passo 1-5)

### 2. Clonar e Instalar

```bash
cd artifacts/arbogame
pnpm install
```

### 3. Variáveis de Ambiente

Já configurado em `.env.local`:
```
VITE_SUPABASE_URL=https://honcvotcxibuezaabybl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Desenvolver

```bash
pnpm dev
# Acesse: http://localhost:5173
```

### 5. Build

```bash
pnpm build
# Produção em: dist/
```

---

## 🎯 Recursos

### 🏆 Ranking System
- Top 10 leaderboard com 🥇🥈🥉
- Pontos em tempo real
- Badges automáticas
- Escolas destacadas

### 🔐 Autenticação
- Sign up / Sign in com Supabase Auth
- Persistência de sessão
- Profile automático
- Segurança com RLS

### 🎮 Games Community
- Criar/deletar seus jogos
- Curtidas (❤️) em tempo real
- Visualizações rastreadas
- Grid responsivo

### 👤 Dashboard
- Seu perfil e stats
- Meus jogos gerenciáveis
- Criar novo jogo
- Ir para ranking

### 🎨 UI/UX
- Design moderno com Tailwind
- Animações (Framer Motion)
- Components (shadcn/ui)
- Responsivo mobile/web

---

## 📚 Rotas Principais

| Rota | Função |
|------|--------|
| `/` | Home |
| `/ranking` | 🏆 Leaderboard |
| `/jogos-app` | 🎮 Todos os jogos |
| `/dashboard` | 📊 Meu perfil *(protegido)* |
| `/criar-jogo` | ✨ Novo jogo *(protegido)* |
| `/meus-jogos` | 🎮 Meus jogos *(protegido)* |

---

## 🎯 Badges

Sistema de badges automático:
1. **Matador de Dengue** 🦟 - Top curtidas
2. **Maga do Conhecimento** 🔮 - Educativo
3. **Mestre Lúdico** 🎮 - Best games
4. **Iniciante** 🌱 - Novo user
5. **Comunidade** 🤝 - Helper

---

## 🗂️ Estrutura

```
artifacts/arbogame/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth global
│   ├── components/
│   │   ├── AuthModal.tsx        # Login/Signup
│   │   ├── Leaderboard.tsx      # Top 10
│   │   ├── GamesGrid.tsx        # Grid jogos
│   │   └── ...
│   ├── pages/
│   │   ├── Ranking.tsx          # /ranking
│   │   ├── Dashboard.tsx        # /dashboard
│   │   ├── CriarJogo.tsx        # /criar-jogo
│   │   ├── MeusJogos.tsx        # /meus-jogos
│   │   ├── JogosApp.tsx         # /jogos-app
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts          # Client
│   └── ...
├── supabase/migrations/
│   └── 002_complete_schema_with_ranking.sql
├── .env.local                   # Variáveis
└── ...
```

---

## 🔧 Stack Técnico

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Animações:** Framer Motion
- **UI:** shadcn/ui
- **Auth:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **Routing:** Wouter
- **Deploy:** Vercel

---

## 📖 Documentação

- **[FINAL_INSTRUCTIONS.md](FINAL_INSTRUCTIONS.md)** - Guia completo com SQL
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Setup técnico
- **[DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)** - Deploy passo-a-passo
- **[CHECKLIST.md](CHECKLIST.md)** - Verificação de tudo

---

## 🚀 Deploy

### Vercel (Automático)

```bash
git add -A
git commit -m "feat: gamification system"
git push origin main
```

Vercel fará deploy automaticamente!

---

## 🧪 Teste Rápido

1. Signup em `/dashboard`
2. Criar jogo em "✨ Criar Jogo"
3. Ver no ranking `/ranking` 🏆
4. Curtir na grid `/jogos-app` ❤️

---

## 🐛 Issues?

### Erro de Conexão
- [ ] Verifique `.env.local`
- [ ] Execute SQL no Supabase
- [ ] Refresh página

### Ranking vazio
- [ ] Confira `leaderboard` view
- [ ] Teste query no SQL Editor

---

## 📊 Banco de Dados

8 tabelas + 1 view:
- `profiles` - Usuários estendido
- `badges` - Badges do sistema
- `games` - Jogos da comunidade
- `likes` - Curtidas
- `comments` - Comentários
- `views` - Visualizações
- `user_badges` - Relação user-badge
- `leaderboard` - View ranking

**RLS:** Habilitado em todas

---

## ✨ Features Principais

✅ Autenticação Email/Senha
✅ Profile por Usuário
✅ Criar/Deletar Jogos
✅ Sistema de Curtidas Real-time
✅ Ranking Automático
✅ Badges Gamificação
✅ Dashboard Pessoal
✅ Mobile Responsivo
✅ Dark Mode Support
✅ TypeScript Type-Safe

---

## 🎉 Status

```
✅ Frontend: Completo
✅ Backend: Completo
✅ Auth: Operacional
✅ Games: Funcional
✅ Ranking: Live
✅ Build: Clean
✅ Deploy: Ready
```

---

## 📝 Próximos Passos

1. **Execute SQL** (veja [FINAL_INSTRUCTIONS.md](FINAL_INSTRUCTIONS.md))
2. **Teste Localmente** (`pnpm dev`)
3. **Deploy** (`git push`)

---

**Desenvolvido com ❤️ para ARBOGAME**

🚀 **[Começar com FINAL_INSTRUCTIONS.md →](FINAL_INSTRUCTIONS.md)**
