import prisma from "../config/prisma.config";
export const UserRepo = {
  findUserByUserName: (name: string) => {
    return prisma.user.findUnique({
      where: {
        username: name,
      },
    });
  },
  findUserByUserId: (userId: string) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
  createUser: (username: string, password: string) => {
    return prisma.user.create({
      data: {
        username,
        password,
      },
    });
  },
};
