"use client";

import { Transaction } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTransaction } from "./actions";
import { Loader2 } from "lucide-react";

type TransactionList = {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
};

const TransactionList = ({
  transactions,
  total,
  page,
  pageSize,
}: TransactionList) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editing, setEditing] = useState<Transaction | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") sp.delete(key);
      else sp.set(key, value);
    });

    router.replace(`/dashboard?${sp.toString()}`);
  };

  const handleFilterFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery({ from: e.target.value || undefined, page: "1" });
  };

  const handleFilterType = (value: string) => {
    updateQuery({ type: value === "all" ? undefined : value, page: "1" });
  };

  const handleFilterTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuery({ to: e.target.value || undefined, page: "1" });
  };

  const handlePageChange = (nextPage: number) => {
    updateQuery({ page: String(nextPage) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-[180px]">
          <label className="block text-sm font-medium mb-2">Type</label>
          <Select
            defaultValue={searchParams.get("type") ?? "all"}
            onValueChange={handleFilterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <Input
            type="date"
            defaultValue={searchParams.get("from") ?? ""}
            onChange={handleFilterFrom}
            className="w-[180px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <Input
            type="date"
            defaultValue={searchParams.get("to") ?? ""}
            onChange={handleFilterTo}
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="[&_th]:px-4 [&_td]:px-4 [&_th]:py-2 [&_td]:py-2">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Date</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-[10%]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{t.type}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.note}</TableCell>
                  <TableCell className="text-right">
                    Rp {t.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(t)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete transaction?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              setLoadingDelete(true);
                              const res = await deleteTransaction(t.id);
                              if (res?.success) {
                                router.refresh();
                              }
                              setLoadingDelete(false);
                            }}
                          >
                            {loadingDelete ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>

          {/* {editing && ( */}
          <TransactionForm
            setOpen={() => setEditing(null)}
            mode="edit"
            defaultValues={{
              id: editing?.id ?? "",
              type: editing?.type ?? "",
              amount: editing?.amount ?? 0,
              category: editing?.category ?? "",
              note: editing?.note ?? "",
              createdAt: editing?.createdAt ?? new Date(),
              date: new Date(editing?.date ?? ""),
            }}
          />
          {/* )} */}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages} • {total} transactions
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
