"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/supabase/helper";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type DashboardClient = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  chartLabels: string[];
  incomeData: number[];
  expenseData: number[];
};

const DashboardClient = ({
  totalIncome,
  totalExpense,
  balance,
  chartLabels,
  incomeData,
  expenseData,
}: DashboardClient) => {
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(34,197,94,0.6)", // green-ish
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "rgba(239,68,68,0.6)", // red-ish
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `${ctx.dataset.label}: ${ctx.raw.toLocaleString("id-ID")}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) =>
            Number(value).toLocaleString("id-ID"),
        },
      },
    },
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-emerald-600">
              {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600">
              {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-semibold ${
                balance >= 0 ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expense (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartLabels.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No data yet. Add some transactions to see the chart.
            </p>
          ) : (
            <Bar data={data} options={options} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardClient;
