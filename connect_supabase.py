#!/usr/bin/env python3
"""
Conectar diretamente ao PostgreSQL Supabase e executar SQL
"""
import os
import sys
import psycopg2
from pathlib import Path
import time

def read_env():
    """Ler credenciais do .env.local"""
    env_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/.env.local")
    
    if not env_file.exists():
        print("❌ .env.local não encontrado")
        return None, None
    
    url = None
    key = None
    
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line.startswith("VITE_SUPABASE_URL"):
                url = line.split("=", 1)[1]
            elif line.startswith("VITE_SUPABASE_ANON_KEY"):
                key = line.split("=", 1)[1]
    
    return url, key

def extract_postgres_url(supabase_url):
    """Converter URL Supabase para PostgreSQL connection string"""
    # https://honcvotcxibuezaabybl.supabase.co → honcvotcxibuezaabybl
    project_id = supabase_url.split("https://")[1].split(".supabase.co")[0]
    
    # Extrair usuario/senha (assumir defaults para Supabase)
    # Username: postgres
    # Database: postgres
    # Port: 5432
    
    postgres_host = f"{project_id}.db.supabase.co"
    
    return {
        "host": postgres_host,
        "port": 5432,
        "database": "postgres",
        "user": "postgres",
    }

def read_sql():
    """Ler arquivo SQL"""
    sql_file = Path("/workspaces/ARBOGAME/artifacts/arbogame/supabase/migrations/002_complete_schema_with_ranking.sql")
    
    if not sql_file.exists():
        print(f"❌ SQL not found: {sql_file}")
        return None
    
    with open(sql_file) as f:
        return f.read()

def main():
    print("""
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║    🔌 CONECTANDO AO SUPABASE POSTGRESQL                       ║
║       Executarão SQL de Ranking + Gamification                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    # Ler credenciais
    supabase_url, supabase_key = read_env()
    if not supabase_url:
        print("❌ Supabase credentials not found in .env.local")
        return False
    
    print(f"✅ Supabase URL: {supabase_url[:50]}...")
    
    # Extrair dados postgres
    pg_config = extract_postgres_url(supabase_url)
    print(f"✅ PostgreSQL Host: {pg_config['host']}")
    print(f"✅ Database: {pg_config['database']}")
    
    # Ler SQL
    sql = read_sql()
    if not sql:
        return False
    
    print(f"✅ SQL File: {len(sql)} bytes, {sql.count(';')} statements\n")
    
    print("⏳ Conectando ao Supabase PostgreSQL...")
    print("   (Isso pode levar alguns segundos)\n")
    
    try:
        # Tentar conexão direta (requer senha do postgres)
        # Supabase não expõe a senha do postgres publicamente por padrão
        # Então vamos ser honesto e dizer que precisa ser feito manualmente
        
        print("""
⚠️  AVISO: Para executar SQL diretamente via psycopg2, precisaríamos da
   senha do usuário 'postgres' no Supabase, que não é fornecida
   publicamente por questões de segurança.

✨ A forma RECOMENDADA é usar a interface web do Supabase, que é:
   • Mais segura
   • Mais rápida
   • Mais confiável
   • Você vê o resultado em tempo real

        """)
        
        print("🎯 VAMOS FAZER ISSO AGORA!\n")
        
        return False
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False

if __name__ == "__main__":
    success = main()
    
    if not success:
        print("""
╔════════════════════════════════════════════════════════════════╗
║                  ✅ PRÓXIMO PASSO                             ║
╚════════════════════════════════════════════════════════════════╝

1️⃣  Abra: https://supabase.com/dashboard

2️⃣  Faça login e selecione projeto: honcvotcxibuezaabybl

3️⃣  No menu esquerdo, clique em: SQL Editor

4️⃣  Clique no botão azul: "New Query"

5️⃣  Abra este arquivo em um editor:
    /workspaces/ARBOGAME/artifacts/arbogame/supabase/
    migrations/002_complete_schema_with_ranking.sql
    
    Copie TODO o conteúdo (Ctrl+A → Ctrl+C)

6️⃣  Cole no SQL Editor do Supabase e clique "Run" ▶️

7️⃣  Pronto! Em 2-3 segundos suas tabelas estarão criadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  Tempo total: ~3 minutos

🎉 Após confirmar que as tabelas foram criadas:
   └─ Próximo: pnpm dev (testar localmente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Precisa de ajuda? Veja:
   📖 FINAL_INSTRUCTIONS.md (passos detalhados com fotos)

        """)
        sys.exit(0)
