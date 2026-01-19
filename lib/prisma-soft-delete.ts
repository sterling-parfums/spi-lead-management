import { Prisma } from "@/app/generated/prisma/client";

export const softDeleteExtension = Prisma.defineExtension({
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
