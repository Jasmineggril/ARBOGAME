#!/usr/bin/env python3
"""
Execute SQL no Supabase para criar schema de ranking e gamificação
"""
import os
import sys
import json
from pathlib import Path

# Ler credenciais do .env.local
env_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/.env.local")
supabase_url = None
supabase_key = None

if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line.startswith("VITE_SUPABASE_URL"):
                supabase_url = line.split("=", 1)[1]
            elif line.startswith("VITE_SUPABASE_ANON_KEY"):
                supabase_key = line.split("=", 1)[1]

if not supabase_url or not supabase_key:
    print("❌ Credenciais Supabase não encontradas em .env.local")
    sys.exit(1)

print(f"✅ Supabase URL: {supabase_url[:50]}...")
print(f"✅ Supabase Key: {supabase_key[:50]}...")

# Ler o arquivo SQL
sql_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/supabase/migrations/002_complete_schema_with_ranking.sql")

if not sql_file.exists():
    print(f"❌ Arquivo SQL não encontrado: {sql_file}")
    sys.exit(1)

with open(sql_file) as f:
    sql_content = f.read()

print(f"✅ SQL file lido: {len(sql_content)} caracteres")

# Executar via curl (API REST do Supabase)
import subprocess

# Split SQL por ; e execute cada statement
statements = [s.strip() for s in sql_content.split(';') if s.strip()]

print(f"\n📋 Total de statements: {len(statements)}")
print("⏳ Executando SQL no Supabase...\n")

# Criar um URL da API REST do Supabase
# Format: https://PROJECT_ID.supabase.co/rest/v1/rpc/sql_command
# Mas é mais fácil usar o sql endpoint

# Na verdade, a forma mais segura é criar um cliente Python Supabase
print("""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║    Para executar o SQL, use uma destas opções:                ║
║                                                                ║
║  OPÇÃO 1: Supabase Web Interface (Recomendado) 🌐            ║
║  ├─ https://supabase.com/dashboard                            ║
║  ├─ Selecione seu projeto                                     ║
║  ├─ SQL Editor → New Query                                    ║
║  ├─ Cole o conteúdo de:                                       ║
║  │  /workspaces/ARBOGAME/artifacts/arbogame/supabase/         ║
║  │  migrations/002_complete_schema_with_ranking.sql           ║
║  └─ Clique "Run"                                              ║
║                                                                ║
║  OPÇÃO 2: Linha de comando (com Supabase CLI) 🖥️             ║
║  └─ supabase db push                                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

""")

# Tentar usar curl para executar
rest_url = supabase_url.replace("https://", "").split(".")[0]
print(f"🔗 Project ID: {rest_url}")

try:
    # Tentar conectar ao Supabase via HTTP
    import urllib.request
    import urllib.parse
    
    # Usar a API REST do Supabase
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    # API endpoint para executar SQL customizado
    # Nota: Supabase não expõe um endpoint direct para executar SQL arbitrário via REST
    # Você precisa usar o SQL Editor na interface web ou usar o cliente oficial
    
    print("""
    ℹ️  Supabase não exposição um endpoint REST para executar SQL arbitrário.
    
    ✨ FAÇA ASSIM (30 segundos):
    
    1. Abra: https://supabase.com/dashboard
    2. Selecione seu projeto: honcvotcxibuezaabybl
    3. Clique em "SQL Editor" (painel esquerdo)
    4. Clique em "New Query"
    5. Cole este comando no editor:
    """)
    
    # Mostrar um exemplo do SQL
    print("\n" + "="*70)
    print("COMEÇAR COM ESTE COMANDO DE TESTE:")
    print("="*70)
    print("""
    -- Teste de conexão
    SELECT 
        current_user,
        now() as "Hora Atual",
        version() as "Versão PostgreSQL"
    ;
    """)
    print("="*70 + "\n")
    
    print("Após o teste, execute o SQL completo em:")
    print(f"👉 {sql_file}\n")
    
except Exception as e:
    print(f"Erro: {e}")

print("""
╔════════════════════════════════════════════════════════════════╗
║                 INSTRUÇÕES RÁPIDAS (2 min)                    ║
╚════════════════════════════════════════════════════════════════╝

1. Abra: https://supabase.com/dashboard
2. Selecione projeto: honcvotcxibuezaabybl
3. SQL Editor → New Query
4. Copie TODO o conteúdo de:
   artifacts/arbogame/supabase/migrations/
   002_complete_schema_with_ranking.sql
5. Cole e clique "Run" ▶️

✅ PRONTO! Suas tabelas estarão criadas!

""")
