import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DB_URL } from "../config/env";

declare global {
  var prisma: PrismaClient;
}

const connectionString = DB_URL;

const adapter = new PrismaPg({ connectionString });

export const prisma = globalThis.prisma || new PrismaClient({ adapter });

export default prisma;
