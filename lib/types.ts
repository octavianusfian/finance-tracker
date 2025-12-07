import z from "zod";

import { TransactionCreateSchema } from "./validations";

export type Transaction = z.infer<typeof TransactionCreateSchema> & {
  createdAt: Date;
  id: string;
};

export type UserDb = {
  id: string;
  email: string;
  supabaseId?: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
};
