import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface LeaderboardUser {
  id: string
  nome: string
  escola: string
  pontos: number
  especialidade: string
  posicao: number
  total_games: number
  total_curtidas: number
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(10)

      if (error) throw error

      setUsers((data as LeaderboardUser[]) || [])
    } catch (err) {
      console.error('Erro ao carregar leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (posicao: number) => {
    if (posicao === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (posicao === 2) return 'bg-gray-100 text-gray-800 border-gray-300'
    if (posicao === 3) return 'bg-orange-100 text-orange-800 border-orange-300'
    return 'bg-blue-50 text-blue-800 border-blue-200'
  }

  const getMedalEmoji = (posicao: number) => {
    if (posicao === 1) return '🥇'
    if (posicao === 2) return '🥈'
    if (posicao === 3) return '🥉'
    return `#${posicao}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Carregando ranking...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">🏆 Ranking ARBOGAME</h2>
        <p className="text-gray-600">Os melhores educadores e criadores de conteúdo</p>
      </div>

      <div className="space-y-3">
        {users.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`border-2 ${getBadgeColor(user.posicao)}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl font-bold min-w-12 text-center">
                      {getMedalEmoji(user.posicao)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{user.nome}</h3>
                      <p className="text-sm text-gray-600">{user.escola}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.especialidade}</Badge>
                  </div>

                  <div className="flex gap-6 text-right min-w-48">
                    <div>
                      <p className="text-2xl font-bold">{user.pontos}</p>
                      <p className="text-xs text-gray-600">pontos</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{user.total_games}</p>
                      <p className="text-xs text-gray-600">jogos</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{user.total_curtidas}</p>
                      <p className="text-xs text-gray-600">curtidas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Nenhum usuário registrado ainda. Seja o primeiro! 🚀
          </CardContent>
        </Card>
      )}
    </div>
  )
}
