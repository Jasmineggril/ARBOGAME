import { Router } from "express";

const router = Router();

const team = [
  { id: 1, name: "Prof. Antonio Augusto", role: "Orientador", course: "UnDF", program: "orientador", bio: "Professor orientador do projeto Arbogame.", photoUrl: null },
  { id: 2, name: "Arthur Mendes Alcoforado", role: "Estudante", course: "Ciência da Computação", program: "pic", bio: null, photoUrl: null },
  { id: 3, name: "Bruno Araújo Sales", role: "Estudante", course: "Engenharia de Software", program: "pibex", bio: null, photoUrl: null },
  { id: 4, name: "Igor Peres Raggi Lacerda", role: "Estudante", course: "Sistemas da Informação", program: "pic", bio: null, photoUrl: null },
  { id: 5, name: "Jasmine de Sá Araújo", role: "Estudante", course: "Engenharia de Software", program: "ambos", bio: null, photoUrl: null },
  { id: 6, name: "Raíssa Carvalho", role: "Estudante", course: "Ciência da Computação", program: "ambos", bio: null, photoUrl: null },
  { id: 7, name: "Vinícius Xavier Alcântara", role: "Estudante", course: "Sistemas da Informação", program: "pibex", bio: null, photoUrl: null },
];

const games = [
  { id: 1, title: "Caça ao Mosquito", description: "Jogo virtual para identificar focos de Aedes aegypti.", kind: "virtual", tags: ["dengue", "prevenção"] },
  { id: 2, title: "Trilha das Arboviroses", description: "Jogo de tabuleiro cooperativo.", kind: "board", tags: ["tabuleiro"] },
  { id: 3, title: "Quiz Arbogame", description: "Quiz híbrido aplicado em escolas.", kind: "hybrid", tags: ["quiz"] },
];

const events = [
  { id: 1, title: "Oficina nas Escolas Públicas do DF", description: "Aplicação dos jogos Arbogame", location: "Brasília · DF", eventDate: "2026-03-14", kind: "oficina", imageUrl: null },
  { id: 2, title: "Apresentação no Congresso de Saúde Coletiva", description: "Comunicação oral dos resultados parciais.", location: "Brasília · DF", eventDate: "2026-04-02", kind: "apresentacao", imageUrl: null },
];

const results = [
  { id: 1, title: "Aplicação Piloto · Caça ao Mosquito", summary: "Aplicação do jogo virtual.", participants: 64, satisfactionScore: 4.6, learningScore: 4.2, methodology: "Pré-pós", createdAt: new Date().toISOString() },
  { id: 2, title: "Trilha das Arboviroses · Oficina Comunitária", summary: "Aplicação do jogo de tabuleiro.", participants: 38, satisfactionScore: 4.8, learningScore: 4.5, methodology: "Grupos", createdAt: new Date().toISOString() },
];

router.get("/team", (_req, res) => res.json(team));
router.get("/games", (_req, res) => res.json(games));
router.get("/events", (_req, res) => res.json(events));
router.get("/results", (_req, res) => res.json(results));
router.get("/documents", (_req, res) => res.json([]));
router.get("/stats", (_req, res) =>
  res.json({ totalGames: games.length, totalParticipants: results.reduce((a, r) => a + (r.participants || 0), 0), totalEvents: events.length, totalDocuments: 0, avgSatisfaction: 4.7 }),
);

export default router;
