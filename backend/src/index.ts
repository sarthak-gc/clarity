import express, { Request, Response, NextFunction } from "express"
import { AppError } from "./utils/error";
import router from "./routes";
const app = express()

app.use(express.json())

app.use("/", router)

app.use((err: AppError, _: Request, res: Response, __: NextFunction) => {
  res.status(400).json({
    success: false,
    msg: err.message,
    status: err.status || 123,
    code: err.code,
  });
  return;
});

app.listen(3000)
