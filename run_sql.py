#!/usr/bin/env python3
"""
Executar SQL no Supabase - Schema de Ranking e Gamificação
"""
import os
import sys
from pathlib import Path
import subprocess

def read_env():
    """Ler .env.local e retornar credenciais"""
    env_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/.env.local")
    
    if not env_file.exists():
        print("❌ .env.local não encontrado")
        return None, None
    
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line.startswith("VITE_SUPABASE_URL"):
                url = line.split("=", 1)[1]
            elif line.startswith("VITE_SUPABASE_ANON_KEY"):
                key = line.split("=", 1)[1]
    
    return url, key

def read_sql():
    """Ler arquivo SQL"""
    sql_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/supabase/migrations/002_complete_schema_with_ranking.sql")
    
    if not sql_file.exists():
        print(f"❌ SQL não encontrado: {sql_file}")
        return None
    
    with open(sql_file) as f:
        return f.read()

def main():
    print("""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🚀 EXECUTANDO SQL NO SUPABASE                          ║
║          Ranking + Gamificação System                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    # Ler credenciais
    url, key = read_env()
    if not url or not key:
        print("❌ Credenciais não encontradas")
        return False
    
    print(f"✅ Supabase URL: {url[:45]}...")
    print(f"✅ Supabase Key: {key[:45]}...\n")
    
    # Ler SQL
    sql = read_sql()
    if not sql:
        return False
    
    print(f"✅ SQL File: {len(sql)} caracteres")
    print(f"✅ Statements: {sql.count(';')} queries\n")
    
    # Usar Supabase CLI ou Interface Web
    print("""
╔════════════════════════════════════════════════════════════════╗
║                  EXECUTAR MANUALMENTE (2 min)                 ║
╚════════════════════════════════════════════════════════════════╝

📋 PASSO 1: Abra Supabase Dashboard
   👉 https://supabase.com/dashboard

📋 PASSO 2: Selecione seu projeto
   👉 honcvotcxibuezaabybl

📋 PASSO 3: SQL Editor
   └─ Lateral esquerda → SQL Editor

📋 PASSO 4: New Query
   └─ Botão azul "New Query"

📋 PASSO 5: Copiar SQL
   👉 Abra este arquivo:
      /workspaces/ARBOGAME/artifacts/arbogame/supabase/
      migrations/002_complete_schema_with_ranking.sql
   
   👉 Copie TODO o conteúdo (Ctrl+A → Ctrl+C)

📋 PASSO 6: Colar e Executar
   └─ Cole no SQL Editor do Supabase
   └─ Clique "Run" ▶️
   └─ Aguarde 1-2 segundos

✅ PRONTO! Suas tabelas foram criadas!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 VERIFICAÇÃO: Após executar, você deve ver:

   📊 Tables criadas:
      ✓ profiles
      ✓ badges
      ✓ games
      ✓ likes
      ✓ comments
      ✓ views
      ✓ user_badges
   
   📈 Views:
      ✓ leaderboard
   
   🔒 Row Level Security:
      ✓ Habilitado em todas as tabelas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ COMO VERIFICAR?

   1. Supabase Dashboard
   2. Lateral: Tables
   3. Você verá suas tables criadas
   4. Click em cada uma para confirmar dados
   5. Check "RLS" column (deve estar como "on")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ TEMPO: 2 minutos

🎯 Próximo: Testar localmente → pnpm dev

    """)
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
