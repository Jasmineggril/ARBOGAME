import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, resultsTable } from "@workspace/db";
import { CreateResultBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/results", async (_req: Request, res: Response) => {
  const rows = await db.select().from(resultsTable).orderBy(desc(resultsTable.createdAt));
  res.json(rows);
});

router.post("/results", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateResultBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(resultsTable)
    .values({
      title: parsed.data.title,
      summary: parsed.data.summary,
      participants: parsed.data.participants,
      satisfactionScore: parsed.data.satisfactionScore ?? null,
      learningScore: parsed.data.learningScore ?? null,
      methodology: parsed.data.methodology,
      gameId: parsed.data.gameId ?? null,
    })
    .returning();
  res.status(201).json(row);
});

router.delete("/results/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(resultsTable).where(eq(resultsTable.id, id));
  res.status(204).end();
});

export default router;
