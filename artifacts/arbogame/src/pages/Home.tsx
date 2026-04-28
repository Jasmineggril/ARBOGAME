import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Microscope,
  Users,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Gamepad2,
  GraduationCap,
  Target,
  Eye,
  Heart,
  ExternalLink,
  Calendar,
  MapPin,
  Upload,
  Smartphone,
  Users2,
  Rocket,
  Network,
  Mail,
  Instagram,
  ClipboardCheck,
  LineChart,
} from "lucide-react";
import {
  useGetStatsOverview,
  useListGames,
  useListResults,
  useListEvents,
  useListTeam,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HeroScene } from "@/components/3d/HeroScene";
import { objectUrl } from "@/lib/api-base";

const KIND_GAME: Record<string, string> = {
  virtual: "Virtual",
  board: "Tabuleiro",
  hybrid: "Híbrido",
};

const KIND_EVENT: Record<string, string> = {
  oficina: "Oficina",
  apresentacao: "Apresentação",
  acao_social: "Ação social",
  evento_academico: "Evento acadêmico",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignment}`}>
      <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: typeof Microscope;
  loading?: boolean;
}) {
  return (
    <Card className="border-card-border bg-card/60 backdrop-blur">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-20" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStatsOverview();
  const { data: games = [] } = useListGames();
  const { data: results = [] } = useListResults();
  const { data: events = [] } = useListEvents();
  const { data: team = [] } = useListTeam();

  const featuredGames = games.slice(0, 3);
  const socialEvents = events.filter((e) => e.kind === "oficina" || e.kind === "acao_social").slice(0, 3);
  const orientador = team.find((m) => m.program === "orientador");
  const students = team.filter((m) => m.program !== "orientador").slice(0, 6);
  const avgSatisfaction = stats?.avgSatisfaction ?? null;
  const learningScores = results
    .map((r) => r.learningScore)
    .filter((s): s is number => typeof s === "number");
  const avgLearning =
    learningScores.length > 0
      ? learningScores.reduce((a, b) => a + b, 0) / learningScores.length
      : null;

  return (
    <div className="overflow-hidden">
      {/* 1. HERO */}
      <section id="hero" className="relative">
        <div className="pointer-events-none absolute inset-x-0 -top-32 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="container mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-12 px-4 py-12 md:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start gap-6"
          >
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-primary">
              Gamificação no combate às arboviroses
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Onde a <span className="text-primary">ciência</span> vira jogo.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              O Arbogame é uma plataforma educativa interativa que combate dengue, zika e
              chikungunya por meio de jogos virtuais, de tabuleiro e híbridos — com pesquisa,
              extensão e impacto social.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2" data-testid="button-hero-jogar">
                <Link href="/jogos">
                  <Gamepad2 className="h-4 w-4" /> Jogar agora
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-hero-resultados">
                <Link href="/resultados">
                  <LineChart className="h-4 w-4" /> Ver resultados
                </Link>
              </Button>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Projeto UnDF · Iniciação Científica + Extensão
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent blur-2xl" />
            <HeroScene />
          </motion.div>
        </div>
      </section>

      {/* Quick stats strip */}
      <section className="container mx-auto max-w-screen-2xl px-4 pb-16 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={Sparkles} label="Jogos" value={stats?.totalGames ?? 0} loading={statsLoading} />
          <StatCard icon={Users} label="Participantes" value={stats?.totalParticipants ?? 0} loading={statsLoading} />
          <StatCard icon={Microscope} label="Eventos" value={stats?.totalEvents ?? 0} loading={statsLoading} />
          <StatCard icon={BookOpen} label="Documentos" value={stats?.totalDocuments ?? 0} loading={statsLoading} />
        </div>
      </section>

      {/* 2. SOBRE */}
      <section id="sobre" className="container mx-auto max-w-screen-2xl px-4 pb-20 md:px-6">
        <SectionTitle
          eyebrow="Sobre"
          title="Educação em saúde, com jogo."
          description="O Arbogame une tecnologia, pesquisa e ação social para enfrentar as arboviroses transmitidas pelo Aedes aegypti — usando a gamificação como ponte entre ciência e comunidade."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldAlert,
              title: "O problema",
              body: "Dengue, zika e chikungunya seguem como ameaça persistente à saúde pública no Brasil — e prevenção depende de educação e mobilização.",
            },
            {
              icon: Gamepad2,
              title: "A solução",
              body: "Jogos virtuais, de tabuleiro e híbridos que ensinam, engajam e transformam aprendizado em ação real.",
            },
            {
              icon: GraduationCap,
              title: "A pesquisa",
              body: "Cada aplicação é mensurada com pré e pós-teste, escalas de satisfação e análise científica do aprendizado.",
            },
          ].map((b) => (
            <Card key={b.title} className="border-card-border hover-elevate">
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
      </section>

      {/* 3. MISSÃO, VISÃO, VALORES */}
      <section id="identidade" className="container mx-auto max-w-screen-2xl px-4 pb-20 md:px-6">
        <SectionTitle eyebrow="Identidade" title="Missão, visão e valores" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-card-border">
            <CardContent className="flex flex-col gap-3 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-widest text-primary">Missão</p>
              </div>
              <p className="text-lg font-semibold leading-snug">
                Promover educação em saúde por meio de jogos interativos, integrando pesquisa
                científica e ação social.
              </p>
            </CardContent>
          </Card>
          <Card className="border-card-border">
            <CardContent className="flex flex-col gap-3 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-widest text-primary">Visão</p>
              </div>
              <p className="text-lg font-semibold leading-snug">
                Ser referência em tecnologia educacional aplicada à saúde, com jogos validados
                cientificamente e usados em escolas e comunidades.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { title: "Educação", body: "Aprendizagem ativa." },
            { title: "Inovação", body: "Tecnologia e gamificação." },
            { title: "Impacto", body: "Atuação direta na sociedade." },
            { title: "Acessibilidade", body: "Conteúdo para todos." },
          ].map((v) => (
            <Card key={v.title} className="border-card-border hover-elevate">
              <CardContent className="flex h-full flex-col gap-1 p-5">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold">{v.title}</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{v.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. JOGOS */}
      <section id="jogos" className="container mx-auto max-w-screen-2xl px-4 pb-20 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Catálogo"
            title="Jogos do Arbogame"
            description="Jogue, aprenda e leve para a sua escola ou comunidade."
          />
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/jogos">Ver todos <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredGames.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3 border-dashed">
              <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
                <Gamepad2 className="h-10 w-10 text-muted-foreground" />
                <p className="text-base font-medium">Os primeiros jogos serão divulgados em breve.</p>
              </CardContent>
            </Card>
          ) : (
            featuredGames.map((game) => {
              const img = objectUrl(game.imageUrl);
              return (
                <Card key={game.id} className="group flex flex-col overflow-hidden border-card-border transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                  {img ? (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={img}
                        alt={game.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15">
                      <Gamepad2 className="h-12 w-12 text-primary/60 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <CardContent className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{KIND_GAME[game.kind] ?? game.kind}</Badge>
                      {game.tags?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">{game.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {game.description}
                    </p>
                    {game.playUrl ? (
                      <Button asChild className="self-start gap-2">
                        <a href={game.playUrl} target="_blank" rel="noreferrer">
                          Jogar <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="outline" className="self-start text-xs">Em breve</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      {/* 5. RESULTADOS */}
      <section id="resultados" className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
          <SectionTitle
            eyebrow="Resultados"
            title="Mensurado, validado, replicável."
            description="Cada aplicação é avaliada com instrumentos validados. Os números a seguir resumem o que já foi feito."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="border-card-border">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Participantes</p>
                <p className="mt-2 text-4xl font-extrabold text-primary">{stats?.totalParticipants ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-card-border">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Estudos</p>
                <p className="mt-2 text-4xl font-extrabold text-primary">{results.length}</p>
              </CardContent>
            </Card>
            <Card className="border-card-border">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Satisfação média</p>
                <p className="mt-2 text-4xl font-extrabold text-primary">
                  {avgSatisfaction != null ? avgSatisfaction.toFixed(1) : "—"}
                  <span className="text-base font-normal text-muted-foreground"> / 5</span>
                </p>
              </CardContent>
            </Card>
            <Card className="border-card-border">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Aprendizagem</p>
                <p className="mt-2 text-4xl font-extrabold text-primary">
                  {avgLearning != null ? avgLearning.toFixed(1) : "—"}
                  <span className="text-base font-normal text-muted-foreground"> / 5</span>
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" className="gap-1">
              <Link href="/resultados">Ver estudos completos <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. TESTES COM USUÁRIOS */}
      <section id="testes" className="container mx-auto max-w-screen-2xl px-4 py-20 md:px-6">
        <SectionTitle
          eyebrow="Validação"
          title="Testes com usuários"
          description="Antes da divulgação, todo jogo passa por testes com público real — para garantir aprendizado, engajamento e clareza."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: ClipboardCheck,
              title: "Como foi",
              body: "Aplicação com termo de consentimento, pré-teste, partida do jogo e pós-teste — em escolas e ações comunitárias.",
            },
            {
              icon: GraduationCap,
              title: "O que aprenderam",
              body: "Avanço médio na identificação de focos do mosquito, sintomas e medidas preventivas — registrado em escala Likert.",
            },
            {
              icon: Sparkles,
              title: "Melhorias aplicadas",
              body: "Cada rodada gera ajustes nas mecânicas, textos, dificuldade e materiais didáticos — ciclo iterativo de evolução.",
            },
          ].map((b) => (
            <Card key={b.title} className="border-card-border hover-elevate">
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
      </section>

      {/* 7. IMPACTO SOCIAL */}
      <section id="impacto" className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="PIBEX · Extensão"
              title="Impacto social"
              description="Levamos o Arbogame para escolas, comunidades e ações de mobilização."
            />
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/impacto">Todas as ações <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {socialEvents.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3 border-dashed">
                <CardContent className="p-10 text-center text-muted-foreground">
                  As ações de extensão serão publicadas conforme acontecem.
                </CardContent>
              </Card>
            ) : (
              socialEvents.map((ev) => {
                const img = objectUrl(ev.imageUrl);
                return (
                  <Card key={ev.id} className="overflow-hidden border-card-border hover-elevate">
                    {img ? (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img src={img} alt={ev.title} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <CardContent className="flex flex-col gap-3 p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{KIND_EVENT[ev.kind] ?? ev.kind}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(ev.eventDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 className="text-base font-bold leading-snug">{ev.title}</h3>
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {ev.location}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {ev.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 8. METODOLOGIA */}
      <section id="metodologia" className="container mx-auto max-w-screen-2xl px-4 py-20 md:px-6">
        <SectionTitle
          eyebrow="Como fazemos"
          title="Metodologia"
          description="Abordagem iterativa, com pesquisa, prototipagem, aplicação em campo e análise científica."
        />
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: "01", title: "Revisão de literatura", body: "Base científica sobre arboviroses e jogos educativos." },
            { n: "02", title: "Concepção dos jogos", body: "Objetivos, mecânicas, públicos-alvo e formato definidos." },
            { n: "03", title: "Prototipagem", body: "Versões iniciais, testes internos e ajustes contínuos." },
            { n: "04", title: "Aplicação em campo", body: "Escolas e ações sociais com pré e pós-teste." },
            { n: "05", title: "Coleta e análise", body: "Dados quantitativos e qualitativos analisados." },
            { n: "06", title: "Divulgação", body: "Relatórios, comunicações e devolução à comunidade." },
          ].map((s) => (
            <li key={s.n}>
              <Card className="h-full border-card-border hover-elevate">
                <CardContent className="flex h-full flex-col gap-2 p-6">
                  <span className="text-3xl font-extrabold tracking-tight text-primary">{s.n}</span>
                  <h3 className="text-base font-bold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="outline" className="gap-1">
            <Link href="/metodologia">Detalhes da metodologia <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* 9. EQUIPE */}
      <section id="equipe" className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="Quem faz"
              title="Equipe Arbogame"
              description="Estudantes da UnDF sob orientação do Prof. Antonio Augusto."
            />
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/equipe">Conhecer a equipe <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          {orientador ? (
            <Card className="mt-10 border-primary/40 bg-primary/5">
              <CardContent className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20 ring-2 ring-primary/30">
                  <AvatarImage src={objectUrl(orientador.photoUrl)} alt={orientador.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {initials(orientador.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Badge className="mb-2 bg-primary text-primary-foreground">Orientador</Badge>
                  <h3 className="text-xl font-bold">{orientador.name}</h3>
                  <p className="text-sm text-muted-foreground">{orientador.role} · {orientador.course}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {students.map((m) => (
              <Card key={m.id} className="border-card-border hover-elevate">
                <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={objectUrl(m.photoUrl)} alt={m.name} />
                    <AvatarFallback className="bg-muted text-base">{initials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.name.split(" ")[0]}</p>
                    <p className="truncate text-[11px] uppercase tracking-widest text-muted-foreground">
                      {m.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PLATAFORMA / UPLOAD */}
      <section id="plataforma" className="container mx-auto max-w-screen-2xl px-4 py-20 md:px-6">
        <Card className="overflow-hidden border-card-border bg-gradient-to-br from-primary/10 via-card to-card">
          <CardContent className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Plataforma
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Uma plataforma viva — em constante evolução.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                A área administrativa permite cadastrar novos jogos, publicar resultados, registrar
                ações sociais e enviar materiais (PDFs, imagens, relatórios). Tudo aparece aqui no
                site automaticamente.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <Link href="/admin">
                    <Upload className="h-4 w-4" /> Acessar plataforma
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/producao">Ver produção acadêmica</Link>
                </Button>
              </div>
            </div>
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-primary/15 text-primary md:h-40 md:w-40">
              <Upload className="h-16 w-16 md:h-20 md:w-20" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 11. FUTURO */}
      <section id="futuro" className="bg-muted/30 py-20">
        <div className="container mx-auto max-w-screen-2xl px-4 md:px-6">
          <SectionTitle
            eyebrow="Próximos passos"
            title="Futuro do projeto"
            description="O Arbogame nasceu como projeto acadêmico, mas mira impacto de longo prazo."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Smartphone, title: "App mobile", body: "Versão para celular com jogos offline." },
              { icon: Rocket, title: "Expansão", body: "Novos jogos e mais arboviroses." },
              { icon: Users2, title: "Mais escolas", body: "Formação de educadores multiplicadores." },
              { icon: Network, title: "Parcerias", body: "Secretarias, ONGs e universidades." },
            ].map((p) => (
              <Card key={p.title} className="border-card-border hover-elevate">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CONTATO */}
      <section id="contato" className="container mx-auto max-w-screen-2xl px-4 py-20 md:px-6">
        <Card className="overflow-hidden border-card-border bg-primary text-primary-foreground">
          <CardContent className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Contato</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Vamos conversar.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed opacity-90 md:text-base">
                Quer levar o Arbogame para sua escola, comunidade ou parceria institucional?
                Fale com a equipe.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:arbogame@undf.edu.br"
                className="group flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-5 ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/20"
                data-testid="link-contato-email"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest opacity-80">E-mail</p>
                  <p className="truncate text-base font-semibold">arbogame@undf.edu.br</p>
                </div>
                <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://instagram.com/arbogameundf"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl bg-primary-foreground/10 p-5 ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/20"
                data-testid="link-contato-instagram"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-widest opacity-80">Instagram</p>
                  <p className="truncate text-base font-semibold">@arbogameundf</p>
                </div>
                <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
