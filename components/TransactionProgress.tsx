import { Progress } from "@/components/ui/progress";

export function TransactionProgress({
  count,
  limit,
}: {
  count: number;
  limit: number;
}) {
  const ratio = (count / limit) * 100;

  return (
    <div className="space-y-1">
      <Progress value={ratio} className="h-3" />

      <p className="text-sm text-muted-foreground">
        {count}/{limit} transactions this month
      </p>
    </div>
  );
}
