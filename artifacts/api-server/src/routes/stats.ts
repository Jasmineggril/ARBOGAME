import { Router, type IRouter, type Request, type Response } from "express";
import { sql, desc } from "drizzle-orm";
import {
  db,
  gamesTable,
  eventsTable,
  resultsTable,
  documentsTable,
  teamMembersTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/overview", async (_req: Request, res: Response) => {
  const [games] = await db.select({ count: sql<number>`count(*)::int` }).from(gamesTable);
  const [events] = await db.select({ count: sql<number>`count(*)::int` }).from(eventsTable);
  const [docs] = await db.select({ count: sql<number>`count(*)::int` }).from(documentsTable);
  const [team] = await db.select({ count: sql<number>`count(*)::int` }).from(teamMembersTable);
  const [resAgg] = await db
    .select({
      totalParticipants: sql<number>`coalesce(sum(${resultsTable.participants}), 0)::int`,
      avgSatisfaction: sql<number | null>`avg(${resultsTable.satisfactionScore})`,
    })
    .from(resultsTable);

  res.json({
    totalGames: games?.count ?? 0,
    totalEvents: events?.count ?? 0,
    totalParticipants: resAgg?.totalParticipants ?? 0,
    totalDocuments: docs?.count ?? 0,
    totalTeamMembers: team?.count ?? 0,
    avgSatisfaction: resAgg?.avgSatisfaction == null ? null : Number(resAgg.avgSatisfaction),
  });
});

router.get("/stats/recent-activity", async (_req: Request, res: Response) => {
  const [recentGames, recentEvents, recentResults, recentDocs] = await Promise.all([
    db
      .select({ id: gamesTable.id, title: gamesTable.title, kind: gamesTable.kind, createdAt: gamesTable.createdAt })
      .from(gamesTable)
      .orderBy(desc(gamesTable.createdAt))
      .limit(5),
    db
      .select({ id: eventsTable.id, title: eventsTable.title, location: eventsTable.location, createdAt: eventsTable.createdAt })
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt))
      .limit(5),
    db
      .select({
        id: resultsTable.id,
        title: resultsTable.title,
        participants: resultsTable.participants,
        createdAt: resultsTable.createdAt,
      })
      .from(resultsTable)
      .orderBy(desc(resultsTable.createdAt))
      .limit(5),
    db
      .select({
        id: documentsTable.id,
        title: documentsTable.title,
        category: documentsTable.category,
        program: documentsTable.program,
        createdAt: documentsTable.createdAt,
      })
      .from(documentsTable)
      .orderBy(desc(documentsTable.createdAt))
      .limit(5),
  ]);

  type Item = {
    id: string;
    kind: "game" | "event" | "result" | "document";
    title: string;
    subtitle: string;
    createdAt: string;
  };

  const items: Item[] = [
    ...recentGames.map((g) => ({
      id: `game-${g.id}`,
      kind: "game" as const,
      title: g.title,
      subtitle: `Jogo · ${g.kind}`,
      createdAt: g.createdAt.toISOString(),
    })),
    ...recentEvents.map((e) => ({
      id: `event-${e.id}`,
      kind: "event" as const,
      title: e.title,
      subtitle: `Evento · ${e.location}`,
      createdAt: e.createdAt.toISOString(),
    })),
    ...recentResults.map((r) => ({
      id: `result-${r.id}`,
      kind: "result" as const,
      title: r.title,
      subtitle: `${r.participants} participantes`,
      createdAt: r.createdAt.toISOString(),
    })),
    ...recentDocs.map((d) => ({
      id: `document-${d.id}`,
      kind: "document" as const,
      title: d.title,
      subtitle: `${d.category} · ${d.program}`,
      createdAt: d.createdAt.toISOString(),
    })),
  ];

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(items.slice(0, 12));
});

export default router;
