import express, { Router } from "express";
import { getPosts } from "../services/CacheData";

const allRouter = Router();
allRouter.get(
  "/latest",
  async (req: express.Request, res: express.Response) => {
    const data = await getPosts(1);
    console.log(data);
    res.send(data);
  }
);

export default allRouter;
