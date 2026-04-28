import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import { db, documentsTable } from "@workspace/db";
import { CreateDocumentBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/documents", async (req: Request, res: Response) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const query = db.select().from(documentsTable).orderBy(desc(documentsTable.createdAt));
  const rows = category
    ? await db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.category, category))
        .orderBy(desc(documentsTable.createdAt))
    : await query;
  res.json(rows);
});

router.post("/documents", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(documentsTable)
    .values({
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      program: parsed.data.program,
      fileUrl: parsed.data.fileUrl,
    })
    .returning();
  res.status(201).json(row);
});

router.delete("/documents/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(documentsTable).where(eq(documentsTable.id, id));
  res.status(204).end();
});

export default router;
