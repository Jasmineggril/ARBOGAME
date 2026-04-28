#!/usr/bin/env node
/**
 * Script para testar a conexão com Supabase
 * Execute com: node supabase/test-connection.mjs
 */

const supabaseUrl = 'https://honcvotcxibuezaabybl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvbmN2b3RjeGlidWV6YWFieWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNDM0MTcsImV4cCI6MjA5MjgxOTQxN30.nWWWIqSil73fFppq4x66_7kc69iOgHVqoc4THQc2d70'

console.log('🔍 Testando conexão com Supabase...\n')
console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${supabaseAnonKey.substring(0, 20)}...`)
console.log('')

// Testar com fetch
async function testar() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/jogadores?limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      console.log('✅ Conexão com Supabase funcionando!')
      console.log(`Status: ${response.status}`)
      const data = await response.json()
      console.log(`Registros na tabela jogadores: ${data.length}`)
      return true
    } else {
      console.log('⚠️ Resposta não-OK do servidor')
      console.log(`Status: ${response.status}`)
      const text = await response.text()
      console.log(`Resposta: ${text}`)
      return false
    }
  } catch (err) {
    console.log('❌ Erro ao conectar no Supabase:')
    console.log(err.message)
    return false
  }
}

testar().then(ok => {
  console.log('')
  if (ok) {
    console.log('🎉 Tudo pronto! O Supabase está funcionando.')
    console.log('📝 Próximas passos:')
    console.log('1. Execute o SQL em supabase/migrations/001_initial_schema.sql via dashboard')
    console.log('2. Rode: pnpm dev')
    console.log('3. Abra a página e confira o console do navegador')
    process.exit(0)
  } else {
    console.log('⚠️  Verifique:')
    console.log('1. As credenciais estão corretas?')
    console.log('2. O projeto no Supabase está ativo?')
    console.log('3. Verifique a conexão de internet')
    process.exit(1)
  }
})
