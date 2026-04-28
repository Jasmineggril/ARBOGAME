import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";

const STEPS = [
  {
    n: "01",
    title: "Revisão de literatura",
    body: "Levantamento sobre arboviroses, métodos de educação em saúde e uso de jogos educativos como ferramenta de aprendizagem.",
  },
  {
    n: "02",
    title: "Concepção dos jogos",
    body: "Definição de objetivos pedagógicos, mecânicas, públicos-alvo e formato (virtual, tabuleiro ou híbrido).",
  },
  {
    n: "03",
    title: "Prototipagem",
    body: "Construção de versões iniciais com testes internos, ajustes de mecânica e validação de conteúdo com referências da área.",
  },
  {
    n: "04",
    title: "Aplicação em campo",
    body: "Aplicação dos jogos em escolas e ações sociais, com termo de consentimento, pré-teste e pós-teste.",
  },
  {
    n: "05",
    title: "Coleta e análise",
    body: "Análise dos dados quantitativos (acertos, escala Likert) e qualitativos (relatos, percepção de aprendizagem).",
  },
  {
    n: "06",
    title: "Divulgação e produção",
    body: "Geração de relatórios, comunicações orais, materiais educativos e devolução para as comunidades.",
  },
];

export default function Metodologia() {
  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeader
        eyebrow="Como fazemos"
        title="Metodologia do Arbogame"
        description="O Arbogame combina pesquisa aplicada e extensão. A metodologia segue etapas claras, replicáveis e auditáveis — exigência fundamental para gerar evidências científicas e impacto real."
      />

      <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n}>
            <Card className="h-full border-card-border hover-elevate">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <span className="text-3xl font-extrabold tracking-tight text-primary">{s.n}</span>
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
