import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { ShieldAlert, Gamepad2, GraduationCap } from "lucide-react";

export default function Sobre() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Sobre o Projeto"
        title="Tecnologia, educação e pesquisa contra as arboviroses."
        description="O Arbogame é uma plataforma interativa que reúne jogos educativos sobre dengue, zika e chikungunya. O projeto une duas frentes acadêmicas — Iniciação Científica e Extensão — sob orientação do Prof. Antonio Augusto na Universidade do Distrito Federal (UnDF)."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            icon: ShieldAlert,
            title: "O problema",
            body: "As arboviroses transmitidas pelo Aedes aegypti — dengue, zika e chikungunya — são um problema persistente de saúde pública no Brasil. A prevenção depende, em boa parte, da educação em saúde e da mobilização comunitária.",
          },
          {
            icon: Gamepad2,
            title: "A solução",
            body: "Usamos a gamificação como ferramenta de aprendizagem ativa. Jogos virtuais, de tabuleiro e híbridos engajam o público em situações reais de identificação de focos, transmissão e prevenção.",
          },
          {
            icon: GraduationCap,
            title: "A pesquisa",
            body: "Cada aplicação dos jogos é avaliada cientificamente: pré e pós-teste, escalas de satisfação e percepção de aprendizagem, análise de resultados e produção acadêmica.",
          },
        ].map((b) => (
          <Card key={b.title} className="border-card-border">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-12 border-card-border bg-primary text-primary-foreground">
        <CardContent className="flex flex-col gap-4 p-8 md:p-12">
          <p className="text-xs uppercase tracking-widest opacity-80">Frase-síntese</p>
          <p className="text-2xl font-bold leading-snug md:text-3xl">
            “O Arbogame integra tecnologia, educação e pesquisa para promover a conscientização sobre
            arboviroses de forma interativa e acessível.”
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
