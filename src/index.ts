import express from "express";
import { config } from "dotenv";
import LatestRouter from "./routers/LatestRouter";
import CacheRouter from "./routers/CacheRouter";

config();
const app = express();
app.use("/", LatestRouter);
app.use("/", CacheRouter);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
