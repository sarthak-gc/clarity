import * as z from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(4, { error: "Username must be at least 4 characters" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});
