import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react'

export function Dashboard() {
  const { user, profile, loading } = useAuth()
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-gray-600 mb-4">Faça login para ver seu dashboard</p>
        <Button onClick={() => setLocation('/')}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Meu Dashboard</h1>
        <p className="text-gray-600">Bem-vindo(a), {profile.nome}! 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pontos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{profile.pontos}</p>
            <p className="text-sm text-gray-600 mt-2">Acumule jogando e criando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Especialidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{profile.especialidade}</p>
            <p className="text-sm text-gray-600 mt-2">Sua classificação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Escola</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{profile.escola}</p>
            <p className="text-sm text-gray-600 mt-2">Sua instituição</p>
          </CardContent>
        </Card>
      </div>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre você</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 min-h-20">
            {profile.bio || 'Nenhuma bio adicionada ainda. Volte aqui para atualizar seu perfil!'}
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="gap-2" onClick={() => setLocation('/meus-jogos')}>
          🎮 Meus Jogos
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setLocation('/criar-jogo')}>
          ➕ Criar Novo Jogo
        </Button>
      </div>
    </div>
  )
}
