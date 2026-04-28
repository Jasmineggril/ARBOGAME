import { Router, type IRouter } from "express";
import { sessionMiddleware } from "../lib/auth";
import healthRouter from "./health";
import authRouter from "./auth";
import gamesRouter from "./games";
import eventsRouter from "./events";
import resultsRouter from "./results";
import documentsRouter from "./documents";
import teamRouter from "./team";
import statsRouter from "./stats";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(sessionMiddleware);

router.use(healthRouter);
router.use(authRouter);
router.use(gamesRouter);
router.use(eventsRouter);
router.use(resultsRouter);
router.use(documentsRouter);
router.use(teamRouter);
router.use(statsRouter);
router.use(storageRouter);

export default router;
