import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { Smartphone, Users2, Rocket, Network } from "lucide-react";

const PLANS = [
  {
    icon: Rocket,
    title: "Expansão dos jogos",
    body: "Novos jogos virtuais e de tabuleiro abordando outras arboviroses e cenários, com mais variedade de mecânicas e públicos.",
  },
  {
    icon: Smartphone,
    title: "Aplicativo Arbogame",
    body: "Versão mobile da plataforma, com jogos offline, conteúdo educativo e ferramentas para profissionais de saúde.",
  },
  {
    icon: Users2,
    title: "Aplicação ampliada",
    body: "Levar as oficinas para mais escolas e regiões do Distrito Federal, com formação de educadores multiplicadores.",
  },
  {
    icon: Network,
    title: "Parcerias",
    body: "Articulação com Secretarias de Saúde, ONGs e outras universidades para integrar o Arbogame a campanhas oficiais.",
  },
];

export default function Futuro() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Próximos passos"
        title="Futuro do Projeto"
        description="O Arbogame nasceu como um projeto acadêmico, mas sua ambição é ser uma plataforma de referência em educação em saúde por meio da gamificação. Estes são os próximos passos."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((p) => (
          <Card key={p.title} className="border-card-border hover-elevate">
            <CardContent className="flex gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
