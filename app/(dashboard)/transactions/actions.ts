"use server";

import { createServerSupabase } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { TransactionCreateSchema } from "@/lib/validations";

type createTransaction = z.infer<typeof TransactionCreateSchema>;

export async function createTransaction(values: createTransaction) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  const result = TransactionCreateSchema.safeParse(values);

  if (!result.success) {
    const allErrors = result.error.issues
      .map((issue) => issue.message)
      .join(", ");

    return { error: allErrors };
  }

  await prisma.transaction.create({
    data: {
      userId: data?.user?.id ?? "1",
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      note: values.note ?? "",
      date: values.date,
    },
  });

  revalidateTag("transactions", "max");
  return { success: true };
}

export async function updateTransaction(id: string, values: createTransaction) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  const result = TransactionCreateSchema.safeParse(values);

  if (!result.success) {
    const allErrors = result.error.issues
      .map((issue) => issue.message)
      .join(", ");

    return { error: allErrors };
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      userId: data?.user?.id ?? "1",
      type: values.type,
      amount: Number(values.amount),
      category: values.category,
      note: values.note ?? "",
      date: values.date,
    },
  });

  revalidateTag("transactions", "max");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  revalidateTag("transactions", "max");
  return { success: true };
}
