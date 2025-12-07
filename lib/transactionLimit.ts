// lib/transactionLimit.ts
import prisma from "./prisma";
import { startOfMonth } from "date-fns";

export const TRANSACTION_LIMIT = 20;

export async function getMonthlyTransactionUsage(userId: string) {
  const count = await prisma.transaction.count({
    where: {
      userId,
      date: {
        gte: startOfMonth(new Date()),
      },
    },
  });

  return {
    count,
    limit: TRANSACTION_LIMIT,
    remaining: Math.max(TRANSACTION_LIMIT - count, 0),
    ratio: Math.min(count / TRANSACTION_LIMIT, 1),
  };
}
