import { Response } from "express";

export const success = (
  res: Response,
  message: string,
  status: number = 200,
  data?: any,
) => {
  res.status(status).json({
    message,
    data,
  });
};
