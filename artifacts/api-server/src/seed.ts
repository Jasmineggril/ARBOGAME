import { db, gamesTable, eventsTable, teamMembersTable, resultsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function main() {
  const [{ count: teamCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamMembersTable);

  if (teamCount === 0) {
    console.log("Seeding team...");
    await db.insert(teamMembersTable).values([
      {
        name: "Prof. Antonio Augusto",
        role: "Orientador",
        course: "UnDF",
        program: "orientador",
        bio: "Professor orientador do projeto Arbogame.",
        sortOrder: 0,
      },
      {
        name: "Arthur Mendes Alcoforado",
        role: "Estudante",
        course: "Ciência da Computação",
        program: "pic",
        bio: "Estudante participante do projeto Arbogame.",
        sortOrder: 1,
      },
      {
        name: "Bruno Araújo Sales",
        role: "Estudante",
        course: "Engenharia de Software",
        program: "pibex",
        bio: "Estudante participante e colaborador nas ações de extensão.",
        sortOrder: 2,
      },
      {
        name: "Igor Peres Raggi Lacerda",
        role: "Estudante",
        course: "Sistemas da Informação",
        program: "pic",
        bio: "Estudante envolvido na análise de dados e metodologia.",
        sortOrder: 3,
      },
      {
        name: "Jasmine de Sá Araújo",
        role: "Estudante",
        course: "Engenharia de Software",
        program: "ambos",
        bio: "Estudante participante nas frentes de pesquisa e extensão.",
        sortOrder: 4,
      },
      {
        name: "Raíssa Carvalho",
        role: "Estudante",
        course: "Ciência da Computação",
        program: "ambos",
        bio: "Estudante atuante em divulgação científica e design educativo.",
        sortOrder: 5,
      },
      {
        name: "Vinícius Xavier Alcântara",
        role: "Estudante",
        course: "Sistemas da Informação",
        program: "pibex",
        bio: "Estudante responsável pela aplicação dos jogos em campo.",
        sortOrder: 6,
      },
    ]);
  } else {
    console.log(`Team already has ${teamCount} members, skipping.`);
  }

  const [{ count: gamesCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(gamesTable);

  if (gamesCount === 0) {
    console.log("Seeding games...");
    await db.insert(gamesTable).values([
      {
        title: "Caça ao Mosquito",
        description:
          "Jogo virtual em que o jogador identifica focos de Aedes aegypti em uma residência, aprendendo medidas práticas de prevenção a dengue, zika e chikungunya.",
        kind: "virtual",
        tags: ["dengue", "prevenção", "Aedes aegypti"],
      },
      {
        title: "Trilha das Arboviroses",
        description:
          "Jogo de tabuleiro cooperativo que percorre os ciclos de transmissão das três principais arboviroses, com cartas de mitos e verdades.",
        kind: "board",
        tags: ["zika", "chikungunya", "tabuleiro", "educação"],
      },
      {
        title: "Quiz Arbogame",
        description:
          "Quiz híbrido (digital + impresso) aplicado em escolas para medir conhecimento sobre transmissão, sintomas e prevenção das arboviroses.",
        kind: "hybrid",
        tags: ["quiz", "escola", "avaliação"],
      },
    ]);
  } else {
    console.log(`Games already has ${gamesCount} entries, skipping.`);
  }

  const [{ count: eventsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(eventsTable);

  if (eventsCount === 0) {
    console.log("Seeding events...");
    await db.insert(eventsTable).values([
      {
        title: "Oficina nas Escolas Públicas do DF",
        description:
          "Aplicação dos jogos Arbogame com estudantes do ensino fundamental, com pré e pós-teste de conhecimento.",
        location: "Brasília · DF",
        eventDate: "2026-03-14",
        kind: "oficina",
      },
      {
        title: "Apresentação no Congresso de Saúde Coletiva",
        description:
          "Comunicação oral dos resultados parciais do PIC sobre uso de jogos educativos no combate às arboviroses.",
        location: "Brasília · DF",
        eventDate: "2026-04-02",
        kind: "apresentacao",
      },
      {
        title: "Ação Social no Dia D Contra a Dengue",
        description:
          "Mobilização comunitária com aplicação dos jogos, vistoria de focos e distribuição de material educativo.",
        location: "Ceilândia · DF",
        eventDate: "2026-02-22",
        kind: "acao_social",
      },
    ]);
  } else {
    console.log(`Events already has ${eventsCount} entries, skipping.`);
  }

  const [{ count: resultsCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(resultsTable);

  if (resultsCount === 0) {
    console.log("Seeding results...");
    await db.insert(resultsTable).values([
      {
        title: "Aplicação Piloto · Caça ao Mosquito",
        summary:
          "Aplicação do jogo virtual em duas turmas de ensino fundamental. Comparação pré e pós-teste mostrou ganho médio significativo de conhecimento sobre focos de Aedes aegypti.",
        participants: 64,
        satisfactionScore: 4.6,
        learningScore: 4.2,
        methodology:
          "Pré-teste, aplicação do jogo, pós-teste, análise estatística pareada.",
      },
      {
        title: "Trilha das Arboviroses · Oficina Comunitária",
        summary:
          "Aplicação do jogo de tabuleiro em ação social. Avaliação por escala Likert mostrou alta satisfação e percepção de aprendizagem.",
        participants: 38,
        satisfactionScore: 4.8,
        learningScore: 4.5,
        methodology:
          "Aplicação em grupos de 4 a 6 pessoas, avaliação por questionário ao final.",
      },
    ]);
  } else {
    console.log(`Results already has ${resultsCount} entries, skipping.`);
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
