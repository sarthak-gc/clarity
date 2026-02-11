import prisma from "../config/prisma.config";
export const CategoryRepo = {
  getAllCategories: (userId: string) => {
    return prisma.category.findMany({
      where: {
        userId,
      },
    });
  },
  editCategory: (id: string, name: string) => {
    return prisma.category.update({
      where: {
        id
      },
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
