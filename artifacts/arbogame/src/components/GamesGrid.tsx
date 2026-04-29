import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

interface Game {
  id: string
  titulo: string
  descricao: string
  categoria: string
  link: string
  imagem_url: string
  user_id: string
  curtidas: number
  visualizacoes: number
  created_at: string
  profiles?: {
    nome: string
    escola: string
  }
}

export function GamesGrid() {
  const { user } = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [likedGames, setLikedGames] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchGames()
    if (user) fetchUserLikes()
  }, [user])

  async function fetchGames() {
    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          profiles:user_id(nome, escola)
        `)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) throw error

      setGames((data as Game[]) || [])
    } catch (err) {
      console.error('Erro ao carregar jogos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserLikes() {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('game_id')
        .eq('user_id', user.id)

      if (error) throw error

      setLikedGames(new Set(data.map((like) => like.game_id)))
    } catch (err) {
      console.error('Erro ao buscar curtidas:', err)
    }
  }

  async function toggleLike(gameId: string) {
    if (!user) {
      alert('Faça login para curtir jogos!')
      return
    }

    try {
      if (likedGames.has(gameId)) {
        // Remove like
        await supabase.from('likes').delete().eq('game_id', gameId).eq('user_id', user.id)
        setLikedGames((prev) => {
          const newSet = new Set(prev)
          newSet.delete(gameId)
          return newSet
        })
      } else {
        // Add like
        await supabase.from('likes').insert([{ game_id: gameId, user_id: user.id }])
        setLikedGames((prev) => new Set(prev).add(gameId))
      }

      // Atualizar lista
      await fetchGames()
    } catch (err) {
      console.error('Erro ao curtir:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Carregando jogos...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">🎮 Jogos Educativos</h2>
        <p className="text-gray-600">Explore os melhores jogos criados pela comunidade</p>
      </div>

      {games.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Nenhum jogo disponível ainda. Seja o primeiro a criar um! 🚀
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                {/* Imagem */}
                {game.imagem_url && (
                  <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-blue-200 to-purple-200">
                    <img
                      src={game.imagem_url}
                      alt={game.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <CardHeader className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <CardTitle className="line-clamp-2">{game.titulo}</CardTitle>
                    <Badge variant="outline">{game.categoria}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{game.descricao}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Criador */}
                  {game.profiles && (
                    <div className="text-sm">
                      <p className="font-semibold">{game.profiles.nome}</p>
                      <p className="text-gray-600">{game.profiles.escola}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-gray-600 py-2 border-y">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {game.visualizacoes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      0
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {game.curtidas}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={() => window.open(game.link, '_blank')}>
                      ▶️ Jogar
                    </Button>
                    <Button
                      variant={likedGames.has(game.id) ? 'default' : 'outline'}
                      className="gap-2"
                      onClick={() => toggleLike(game.id)}
                    >
                      {likedGames.has(game.id) ? '❤️' : '🤍'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
