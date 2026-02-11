import express, { Request, Response, NextFunction } from "express";
import { AppError } from "./utils/error";
import router from "./routes";

import cors from "cors";
import { FRONTEND_URL, PORT } from "./config/env";

const app = express();

app.use(cors({ origin: FRONTEND_URL }));

app.use(express.json());

app.use("/", router);

app.use((err: AppError, _: Request, res: Response, __: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    msg: err.message,
    status: err.status || 123,
    code: err.code,
  });
  return;
});

app.listen(PORT);
