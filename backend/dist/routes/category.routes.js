"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_repo_1 = require("../repo/category.repo");
const success_1 = require("../utils/success");
const error_1 = require("../utils/error");
const category_validation_1 = require("../validations/category.validation");
const categoryRoutes = (0, express_1.Router)();
categoryRoutes.post('/', async (req, res) => {
    const { data, error } = category_validation_1.createCategorySchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { name } = data;
    await category_repo_1.CategoryRepo.addCategory(name);
    (0, success_1.success)(res, "Category created");
});
categoryRoutes.delete('/:categoryId', async (req, res) => {
    const { data, error } = category_validation_1.categoryIdSchema.safeParse(req.params);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { categoryId } = data;
    const category = await category_repo_1.CategoryRepo.getCategoryById(categoryId);
    if (!category) {
        throw new error_1.NotFoundError("Category not found");
    }
    await category_repo_1.CategoryRepo.removeCategory(categoryId);
    (0, success_1.success)(res, "Category deleted");
});
categoryRoutes.patch('/:categoryId', async (req, res) => {
    const { data: categoryIdData, error: categoryIdError } = category_validation_1.categoryIdSchema.safeParse(req.params);
    if (categoryIdError) {
        throw new error_1.BadRequestError(JSON.parse(categoryIdError.message)[0].message);
    }
    const { categoryId } = categoryIdData;
    const category = await category_repo_1.CategoryRepo.getCategoryById(categoryId);
    if (!category) {
        throw new error_1.NotFoundError("Category not found");
    }
    const { data, error } = category_validation_1.createCategorySchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { name } = data;
    if (!name) {
        throw new error_1.BadRequestError("Name is required");
    }
    await category_repo_1.CategoryRepo.editCategory(name);
    (0, success_1.success)(res, "Category created");
});
categoryRoutes.get('/', async (req, res) => {
    const userId = req.userId;
    const categories = await category_repo_1.CategoryRepo.getAllCategories(userId);
    (0, success_1.success)(res, "Category created", 200, { categories });
});
exports.default = categoryRoutes;
