import express from "express";
import LatestRouter from "./routers/LatestRouter";
import CacheRouter from "./routers/CacheRouter";

const app = express();
app.use("/", LatestRouter);
app.use("/", CacheRouter);
app.listen(30000, () => {
  console.log(`Server is running on port 30000`);
});
