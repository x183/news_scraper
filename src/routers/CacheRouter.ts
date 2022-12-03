import express, { Router } from "express";
import { getPosts } from "../services/CacheData";

const CacheRouter = Router();
CacheRouter.get(
  "/cache",
  async (req: express.Request, res: express.Response) => {
    await getPosts(1);
    res.send("data cached");
  }
);

export default CacheRouter;
