import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getCurrent() {
  const current = await prisma.report.findMany({
    where: {
      current: true,
      visible: true,
    },
  });

  return getReport(current[0].slug);
}

export async function getReport(slug) {
  return await prisma.report.findMany({
    where: {
      slug: slug,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      captures: {
        orderBy: {
          slug: "asc",
        },
        select: {
          slug: true,
          urlmin: true,
          page: {
            select: {
              slug: true,
              reportcount: true,
            },
          },
          device: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      },
    },
  });
}

export async function getDevices() {
  return await prisma.device.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
    },
  });
}
