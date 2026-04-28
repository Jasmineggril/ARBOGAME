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
      eventDate: parsed.data.eventDate.toISOString(),
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
  const updateData: Record<string, any> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.kind !== undefined) updateData.kind = parsed.data.kind;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.location !== undefined) updateData.location = parsed.data.location;
  if (parsed.data.eventDate !== undefined) updateData.eventDate = parsed.data.eventDate.toISOString();
  
  const [row] = await db
    .update(eventsTable)
    .set(updateData)
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
