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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionProgress } from "@/components/TransactionProgress";
import { UserDb } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type DashboardClient = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  chartLabels: string[];
  incomeData: number[];
  expenseData: number[];
  usage: { count: number; limit: number; remaining: number; ratio: number };
};

const DashboardClient = ({
  totalIncome,
  totalExpense,
  balance,
  chartLabels,
  incomeData,
  expenseData,
  usage,
}: DashboardClient) => {
  const [exchangeRates, setExchangeRates] = useState<
    { currency: string; nominal: number }[]
  >([]);
  const [loadingExchangeRates, setLoadingExchangeRates] = useState(true);
  const [errorExchangeRates, setErrorExchangeRates] = useState(false);
  const [userDb, setUserDb] = useState<UserDb | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/getUser");
        console.log(res.data.user);

        setUserDb(res.data.user);
      } catch (error) {
        console.log(error);
      }
      setLoadingUsage(false);
    };

    fetchUserData();
  }, []);

  const usdRate = exchangeRates.find((rate) => rate.currency === "IDR");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/rates");
        const data = Object.entries(res.data.data.conversion_rates).map(
          (converse) => ({
            currency: converse[0],
            nominal: converse[1] as number,
          })
        );
        console.log(data);

        setExchangeRates(data);
        setLoadingExchangeRates(false);
      } catch (error) {
        console.log(error);
        setErrorExchangeRates(true);
      }
    };

    fetchData();
  }, []);

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
          callback: (value: number | string) => {
            const idr = Number(value);
            const usd = idr / (usdRate?.nominal ?? 1);

            return [
              `Rp ${idr.toLocaleString("id-ID")}`, // line 1
              `($ ${usd.toFixed(2)})`, // line 2
            ];
          },
        },
      },
    },
  };
  return (
    <div className="space-y-6">
      {loadingUsage ? (
        <Skeleton className="h-[100px]"></Skeleton>
      ) : !userDb?.isPremium ? (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionProgress count={usage.count} limit={usage.limit} />
              {usage.remaining === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  You’ve reached the limit. Upgrade to create more transactions.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
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

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Card>
            <CardContent>
              {loadingExchangeRates ? (
                <div className="space-y-2">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              ) : errorExchangeRates ? (
                <p>Loading exchange rates...</p>
              ) : (
                <ScrollArea className="h-[400px] rounded-md border">
                  <Table>
                    <TableCaption>Exchange Rates</TableCaption>
                    <TableHeader className="top-0 z-10 shadow-sm sticky">
                      <TableRow>
                        <TableHead className="w-[100px]">Currency</TableHead>
                        <TableHead>Rate (from USD)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exchangeRates.map((rate) => (
                        <TableRow key={rate.currency}>
                          <TableCell className="w-[100px]">
                            {rate.currency}
                          </TableCell>
                          <TableCell>{rate.nominal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
