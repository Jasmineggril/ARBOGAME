import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AuthModal() {
  const { isOpen, closeAuth, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular delay de requisição
    setTimeout(() => {
      if (mode === 'login') {
        login(email, password);
      } else {
        signup(name, email, password);
      }
      setLoading(false);
      setEmail('');
      setPassword('');
      setName('');
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeAuth}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Acesse sua conta do ARBOGAME'
              : 'Junte-se à comunidade ARBOGAME'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Entrando...
              </>
            ) : mode === 'login' ? (
              'Entrar'
            ) : (
              'Criar Conta'
            )}
          </Button>
        </form>

        <div className="border-t pt-4">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="w-full text-sm text-primary hover:underline"
          >
            {mode === 'login'
              ? 'Não tem conta? Criar uma'
              : 'Já tem conta? Entrar'}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          💡 Esta é uma amostra. Login não persiste dados.
        </p>
      </DialogContent>
    </Dialog>
  );
}
