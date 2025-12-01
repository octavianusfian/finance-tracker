import z from "zod";

export const TransactionCreateSchema = z.object({
  type: z.string().min(1, "Type is required"),
  amount: z.number().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  note: z.string().nullable(),
  date: z.date(),
});


