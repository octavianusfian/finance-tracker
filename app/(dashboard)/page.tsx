import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getMonthlyTransactionUsage } from "@/lib/transactionLimit";

const DashboardPage = async () => {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  const userId = data.user.id;
  const usage = await getMonthlyTransactionUsage(userId);

  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "expense" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount ?? 0;
  const totalExpense = expenseAgg._sum.amount ?? 0;
  const balance = totalIncome - totalExpense;

  const since = new Date();
  since.setMonth(since.getMonth() - 5); // last 6 months

  const recent = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: since },
    },
    orderBy: { date: "asc" },
  });

  const monthlyMap = new Map<string, { income: number; expense: number }>();

  for (const t of recent) {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { income: 0, expense: 0 });
    }

    const bucket = monthlyMap.get(key)!;
    if (t.type === "income") bucket.income += t.amount;
    if (t.type === "expense") bucket.expense += t.amount;
  }

  const chartLabels = Array.from(monthlyMap.keys());
  const incomeData = chartLabels.map((key) => monthlyMap.get(key)!.income);
  const expenseData = chartLabels.map((key) => monthlyMap.get(key)!.expense);

  return (
    <DashboardClient
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
      chartLabels={chartLabels}
      incomeData={incomeData}
      expenseData={expenseData}
      usage={usage}
    />
  );
};

export default DashboardPage;
