import { Router, type IRouter, type Request, type Response } from "express";
import { AdminLoginBody } from "@workspace/api-zod";
import { checkPassword } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", (req: Request, res: Response) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  if (!checkPassword(parsed.data.password)) {
    res.status(401).json({ message: "Senha incorreta" });
    return;
  }
  req.session.isAdmin = true;
  req.session.save((err) => {
    if (err) {
      req.log.error({ err }, "Error saving session");
      res.status(500).json({ message: "Failed to save session" });
      return;
    }
    res.json({ isAdmin: true });
  });
});

router.post("/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Error destroying session");
    }
    res.clearCookie("arbogame.sid");
    res.json({ isAdmin: false });
  });
});

router.get("/auth/me", (req: Request, res: Response) => {
  res.json({ isAdmin: Boolean(req.session?.isAdmin) });
});

export default router;
