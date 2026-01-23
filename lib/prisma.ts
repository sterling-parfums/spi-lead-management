import { Prisma, PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const softDeleteExtension = Prisma.defineExtension({
  name: "softDelete",

  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = withNotDeleted(args.where);
        return query(args);
      },

      async findFirst({ args, query }) {
        args.where = withNotDeleted(args.where);
        return query(args);
      },

      async count({ args, query }) {
        args.where = withNotDeleted(args.where);
        return query(args);
      },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withNotDeleted(where: any) {
  if (!where) return { deletedAt: null };

  // Opt-out escape hatch
  if (where.deletedAt !== undefined) {
    return where;
  }

  return {
    AND: [where, { deletedAt: null }],
  };
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  }).$extends(softDeleteExtension);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
