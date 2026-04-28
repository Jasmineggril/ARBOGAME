import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import { CreateEventBody, UpdateEventBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/events", async (_req: Request, res: Response) => {
  const rows = await db.select().from(eventsTable).orderBy(desc(eventsTable.eventDate));
  res.json(rows);
});

router.post("/events", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(eventsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      eventDate: parsed.data.eventDate,
      kind: parsed.data.kind,
      imageUrl: parsed.data.imageUrl ?? null,
    })
    .returning();
  res.status(201).json(row);
});

router.patch("/events/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(eventsTable)
    .set(parsed.data)
    .where(eq(eventsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ message: "Event not found" });
    return;
  }
  res.json(row);
});

router.delete("/events/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.status(204).end();
});

export default router;
