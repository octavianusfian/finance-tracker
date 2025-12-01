import AddTransaction from "@/components/AddTransaction";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TransactionList from "../dashboard/TransactionList";
import prisma from "@/lib/prisma";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    type: "income" | "expense";
    from: "string";
    to: "string";
  }>;
}) => {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const { page, type, from, to } = await searchParams;

  if (!data?.user) {
    redirect("/login");
  }

  const userId = data.user.id;
  const pageSize = 10;
  const pageQuery = Math.max(Number(page ?? 1), 1);

  const typeQuery = type as "income" | "expense" | undefined;
  const fromQuery = from ? new Date(from) : undefined;
  const toQuery = to ? new Date(to) : undefined;

  const where: any = {
    userId,
  };

  if (typeQuery) {
    where.type = typeQuery;
  }

  if (fromQuery || toQuery) {
    where.date = {};
    if (fromQuery) where.date.gte = fromQuery;
    if (toQuery) {
      // include whole "to" day
      const toEnd = new Date(toQuery);
      toEnd.setHours(23, 59, 59, 999);
      where.date.lte = toEnd;
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (pageQuery - 1) * pageSize,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <AddTransaction />
      </div>
      <TransactionList
        transactions={transactions}
        total={total}
        page={pageQuery}
        pageSize={pageSize}
      />
    </div>
  );
};

export default DashboardPage;
