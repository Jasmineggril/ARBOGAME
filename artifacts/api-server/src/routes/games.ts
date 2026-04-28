import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, gamesTable } from "@workspace/db";
import { CreateGameBody, UpdateGameBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/games", async (_req: Request, res: Response) => {
  const rows = await db.select().from(gamesTable).orderBy(desc(gamesTable.createdAt));
  res.json(rows);
});

router.get("/games/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(gamesTable).where(eq(gamesTable.id, id));
  if (!row) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  res.json(row);
});

router.post("/games", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(gamesTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      kind: parsed.data.kind,
      playUrl: parsed.data.playUrl ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      tags: parsed.data.tags ?? [],
    })
    .returning();
  res.status(201).json(row);
});

router.patch("/games/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(gamesTable)
    .set(parsed.data)
    .where(eq(gamesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  res.json(row);
});

router.delete("/games/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(gamesTable).where(eq(gamesTable.id, id));
  res.status(204).end();
});

export default router;
