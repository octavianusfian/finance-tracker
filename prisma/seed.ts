import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const transactionData: Prisma.TransactionCreateInput[] = [
  {
    userId: "user-1",
    type: "income",
    amount: 5000000,
    category: "Salary",
    note: "Monthly salary",
  },
  {
    userId: "user-1",
    type: "expense",
    amount: 250000,
    category: "Food",
    note: "Lunch with friends",
  },
];

export async function main() {
  for (const t of transactionData) {
    await prisma.transaction.create({ data: t });
  }
}

main();
