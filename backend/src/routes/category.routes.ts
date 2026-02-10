import { Router } from "express";
import { CategoryRepo } from "../repo/category.repo";
import { success } from "../utils/success";
import { BadRequestError, NotFoundError } from "../utils/error";
import {
  categoryIdSchema,
  createCategorySchema,
} from "../validations/category.validation";

const categoryRoutes = Router();

categoryRoutes.post("/", async (req, res) => {
  const { data, error } = createCategorySchema.safeParse(req.body);
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }
  const { name } = data;
  const category = await CategoryRepo.addCategory(name, req.userId);
  success(res, "Category created", 201, { category });
});

categoryRoutes.delete("/:categoryId", async (req, res) => {
  const { data, error } = categoryIdSchema.safeParse(req.params);
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }
  const { categoryId } = data;
  const category = await CategoryRepo.getCategoryById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  await CategoryRepo.removeCategory(categoryId);
  success(res, "Category deleted");
});

categoryRoutes.patch("/:categoryId", async (req, res) => {
  const { data: categoryIdData, error: categoryIdError } =
    categoryIdSchema.safeParse(req.params);
  if (categoryIdError) {
    throw new BadRequestError(JSON.parse(categoryIdError.message)[0].message);
  }
  const { categoryId } = categoryIdData;
  const category = await CategoryRepo.getCategoryById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  const { data, error } = createCategorySchema.safeParse(req.body);
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }
  const { name } = data;
  if (!name) {
    throw new BadRequestError("Name is required");
  }
  await CategoryRepo.editCategory(name);
  success(res, "Category updated");
});

categoryRoutes.get("/", async (req, res) => {
  const userId = req.userId;
  const categories = await CategoryRepo.getAllCategories(userId);
  success(res, "All categoryId retrieved", 200, { categories });
});
export default categoryRoutes;
