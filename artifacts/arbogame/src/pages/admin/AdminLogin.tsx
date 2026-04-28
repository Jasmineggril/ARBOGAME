import { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminLogin, getGetAuthStatusQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, AlertCircle } from "lucide-react";
import logo from "@assets/581735181_17852990877576365_1252896578201900588_n_1777147104021.jpg";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const login = useAdminLogin();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ data: { password } });
      await queryClient.invalidateQueries({ queryKey: getGetAuthStatusQueryKey() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha no login";
      setError(message.includes("401") ? "Senha incorreta. Tente novamente." : message);
    }
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-16">
      <Card className="w-full border-card-border">
        <CardContent className="flex flex-col gap-5 p-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Arbogame" className="h-12 w-12 rounded-lg ring-1 ring-border" />
            <div>
              <p className="text-base font-bold">Área administrativa</p>
              <p className="text-xs text-muted-foreground">Acesso restrito à equipe Arbogame</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Label htmlFor="password">Senha de administrador</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoFocus
                required
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            ) : null}
            <Button type="submit" disabled={login.isPending} className="mt-2">
              {login.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
