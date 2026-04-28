import { Router, type IRouter, type Request, type Response } from "express";
import { eq, asc } from "drizzle-orm";
import { db, teamMembersTable } from "@workspace/db";
import { CreateTeamMemberBody, UpdateTeamMemberBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.get("/team", async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(teamMembersTable)
    .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
  res.json(rows);
});

router.post("/team", requireAdmin, async (req: Request, res: Response) => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(teamMembersTable)
    .values({
      name: parsed.data.name,
      role: parsed.data.role,
      course: parsed.data.course,
      program: parsed.data.program,
      bio: parsed.data.bio ?? null,
      photoUrl: parsed.data.photoUrl ?? null,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();
  res.status(201).json(row);
});

router.patch("/team/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(teamMembersTable)
    .set(parsed.data)
    .where(eq(teamMembersTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ message: "Team member not found" });
    return;
  }
  res.json(row);
});

router.delete("/team/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
  res.status(204).end();
});

export default router;
