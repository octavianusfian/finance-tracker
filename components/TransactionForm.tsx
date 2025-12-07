"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { CurrencyInput } from "./NumberInput";
import DatePicker from "./DatePicker";
import { Transaction } from "@/lib/types";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { TransactionCreateSchema } from "@/lib/validations";
import z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createTransaction,
  updateTransaction,
} from "@/app/(dashboard)/transactions/actions";
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

type TransactionFormProps = {
  mode: "create" | "edit";
  defaultValues?: Transaction; // from zod
  setOpen?: (value: boolean) => void;
};

const TransactionForm = ({
  setOpen,
  defaultValues,
  mode,
}: TransactionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof TransactionCreateSchema>>({
    resolver: zodResolver(TransactionCreateSchema),
    defaultValues: defaultValues ?? {
      type: "income",
      amount: 0,
      category: "",
      date: new Date(),
      note: "",
    },
  });

  type FormValues = z.infer<typeof TransactionCreateSchema>;

  const handleSubmit = async (values: FormValues) => {
    console.log(defaultValues);
    let res;
    if (mode === "create") {
      res = await createTransaction(values);
    } else {
      res = await updateTransaction(defaultValues?.id as string, values);
    }

    if (res?.error) {
      // toast.error("Failed to create transaction");
      toast.error(res.error);
    }

    if (res?.success) {
      toast.success("Success to create transaction");
      router.refresh();
      if (setOpen) {
        setOpen(false);
      }
      form.reset();
      // toast.success("Transaction created!");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex gap-5">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="income" id="income" />
                          <Label htmlFor="income">Income</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="expense" id="expense" />
                          <Label htmlFor="expense">Expense</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      id="amount"
                      value={field.value}
                      onValueChange={(num) => {
                        field.onChange(num);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      id="category"
                      value={field.value}
                      onChange={field.onChange}
                      // name="amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      id="note"
                      value={field.value as string}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TransactionForm;
