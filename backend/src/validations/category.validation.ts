import * as z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, { error: "Category name is required" }),
});

export const categoryIdSchema = z.object({
  categoryId: z.string().min(1, { error: "categoryId is required" }),
});
