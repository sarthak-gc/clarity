import prisma from "../config/prisma.config";
export const CategoryRepo = {
  getAllCategories: (userId: string) => {
    return prisma.category.findMany({
      where: {
        userId,
      },
    });
  },
  editCategory: (name: string) => {
    return prisma.category.create({
      data: {
        name,
      },
    });
  },
  addCategory: (name: string, userId: string) => {
    return prisma.category.create({
      data: {
        name,
        userId,
      },
    });
  },
  removeCategory: (id: string) => {
    return prisma.category.delete({
      where: { id },
    });
  },

  getCategoryById: (id: string) => {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  },
};
