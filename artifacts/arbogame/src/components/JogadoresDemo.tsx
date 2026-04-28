import { useEffect, useState } from 'react'
import { testarConexao, buscarJogadores, type Jogador } from '@/lib/queries/jogadores'

export function JogadoresDemo() {
  const [conectado, setConectado] = useState(false)
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true)

      // 1. Testar conexão
      const ok = await testarConexao()
      setConectado(ok)

      // 2. Se conectado, buscar jogadores
      if (ok) {
        const dados = await buscarJogadores()
        setJogadores(dados)
      }

      setCarregando(false)
    }

    carregarDados()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teste de Conexão Supabase</h2>

      <div className="mb-4">
        {conectado ? (
          <p className="text-green-600 font-semibold">✅ Conectado ao Supabase</p>
        ) : (
          <p className="text-red-600 font-semibold">❌ Erro na conexão com Supabase</p>
        )}
      </div>

      {carregando ? (
        <p className="text-gray-600">Carregando jogadores...</p>
      ) : (
        <div>
          <p className="mb-4 text-gray-700">
            Total de jogadores: <span className="font-bold">{jogadores.length}</span>
          </p>

          {jogadores.length > 0 ? (
            <div className="space-y-2">
              {jogadores.map((jogador) => (
                <div
                  key={jogador.id}
                  className="p-3 border border-gray-300 rounded-lg bg-gray-50"
                >
                  <p className="font-semibold">{jogador.nome}</p>
                  {jogador.email && <p className="text-sm text-gray-600">{jogador.email}</p>}
                  {jogador.pontuacao !== undefined && (
                    <p className="text-sm text-gray-600">Pontuação: {jogador.pontuacao}</p>
                  )}
                  {jogador.progresso !== undefined && (
                    <p className="text-sm text-gray-600">Progresso: {jogador.progresso}%</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum jogador encontrado. Crie um para testar!</p>
          )}
        </div>
      )}
    </div>
  )
}
