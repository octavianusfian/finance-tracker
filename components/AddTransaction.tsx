"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import TransactionForm from "./TransactionForm";

const AddTransaction = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">New Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">Add Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm setOpen={setOpen} mode="create" />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
