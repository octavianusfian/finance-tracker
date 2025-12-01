import z from "zod";

import { TransactionCreateSchema } from "./validations";

export type Transaction = z.infer<typeof TransactionCreateSchema> & {
  createdAt: Date;
  id: string;
};
