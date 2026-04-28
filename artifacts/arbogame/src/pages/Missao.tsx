import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";

const VALUES = [
  { title: "Educação", body: "Aprendizagem ativa como ferramenta de transformação social." },
  { title: "Inovação", body: "Tecnologia e gamificação aplicadas à saúde pública." },
  { title: "Impacto social", body: "Atuação direta com comunidades, escolas e parceiros." },
  { title: "Acessibilidade", body: "Conteúdos e jogos pensados para diferentes públicos." },
  { title: "Tecnologia", body: "Plataforma digital interativa, mensurável e replicável." },
];

export default function Missao() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Identidade do Projeto"
        title="Missão, Visão e Valores"
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-card-border">
          <CardContent className="flex flex-col gap-3 p-8">
            <p className="text-xs uppercase tracking-widest text-primary">Missão</p>
            <p className="text-lg font-semibold leading-snug">
              Promover a conscientização sobre arboviroses por meio de jogos educativos interativos,
              integrando pesquisa científica e ação social.
            </p>
          </CardContent>
        </Card>
        <Card className="border-card-border">
          <CardContent className="flex flex-col gap-3 p-8">
            <p className="text-xs uppercase tracking-widest text-primary">Visão</p>
            <p className="text-lg font-semibold leading-snug">
              Tornar-se referência em educação em saúde por meio da tecnologia, com jogos validados
              cientificamente e aplicados em escolas e comunidades.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Valores</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((v) => (
            <Card key={v.title} className="border-card-border hover-elevate">
              <CardContent className="flex h-full flex-col gap-2 p-5">
                <p className="text-base font-bold">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
