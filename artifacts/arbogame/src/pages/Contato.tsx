import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Contato() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const contactEmail = "arbogame@undf.edu.br";
  const instagram = "@arbogameundf";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !message) {
      toast({ title: "Preencha e-mail e mensagem", description: "Por favor informe seu e-mail e uma mensagem." });
      return;
    }

    const subject = encodeURIComponent(`Contato · Arbogame - ${name || email}`);
    const body = encodeURIComponent(message + "\n\n" + (name ? `Nome: ${name}\n` : ""));
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    toast({ title: "Abrindo cliente de e-mail", description: "Você pode enviar a mensagem pelo seu cliente de e-mail." });
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader eyebrow="Contato" title="Fale com a equipe do Arbogame" description="Envie dúvidas, sugestões ou solicitações de parceria. Responderemos em breve." />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-card-border">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Contato direto</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">Canais oficiais do projeto</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Use este espaço para entrar em contato com a equipe, tirar dúvidas sobre os jogos ou propor ações em escolas e comunidades.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">E-mail institucional</span>
                  <span className="block text-sm text-muted-foreground">{contactEmail}</span>
                </span>
              </a>

              <a
                href="https://instagram.com/arbogameundf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Instagram className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Instagram</span>
                  <span className="block text-sm text-muted-foreground">{instagram}</span>
                </span>
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">Local</span>
                  <span className="block text-sm text-muted-foreground">Universidade do Distrito Federal</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Nome (opcional)</span>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">E-mail</span>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@exemplo.com" type="email" />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Mensagem</span>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escreva sua mensagem" rows={8} />
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Button type="submit">Enviar mensagem</Button>
                <p className="text-xs text-muted-foreground">O formulário abre seu cliente de e-mail com a mensagem pronta.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
