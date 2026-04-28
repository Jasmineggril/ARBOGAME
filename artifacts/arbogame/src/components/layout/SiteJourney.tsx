import { Link, useLocation } from "wouter";
import { ArrowRight, Compass, Gamepad2, LineChart, Mail } from "lucide-react";

const journeySteps = [
  {
    href: "/sobre",
    label: "Entenda o projeto",
    description: "Conheça a proposta, a missão e a base científica.",
    icon: Compass,
  },
  {
    href: "/jogos",
    label: "Explore os jogos",
    description: "Veja as experiências interativas já disponíveis.",
    icon: Gamepad2,
  },
  {
    href: "/resultados",
    label: "Veja os resultados",
    description: "Acompanhe os números, estudos e validações.",
    icon: LineChart,
  },
  {
    href: "/contato",
    label: "Fale com a equipe",
    description: "Entre em contato para parceria, dúvida ou convite.",
    icon: Mail,
  },
];

export function SiteJourney() {
  const [location] = useLocation();

  if (location.startsWith("/admin")) {
    return null;
  }

  return (
    <section className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto max-w-screen-2xl px-4 py-4 md:px-6 md:py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Fluxo recomendado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Um caminho curto para conhecer, experimentar e se conectar com o Arbogame.
            </p>
          </div>
          <Link href="/jogos" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Começar pelo jogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((step) => {
            const isActive = location === step.href || location.startsWith(`${step.href}/`);
            const Icon = step.icon;

            return (
              <Link
                key={step.href}
                href={step.href}
                className={`group flex items-start gap-3 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                  isActive
                    ? "border-primary/40 bg-primary/10 shadow-sm shadow-primary/10"
                    : "border-border/60 bg-card/80"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{step.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{step.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
