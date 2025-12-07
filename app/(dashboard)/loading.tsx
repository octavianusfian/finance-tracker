import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[150px] rounded-xl" />
      <Skeleton className="h-[150px] rounded-xl" />
      <Skeleton className="h-[150px] rounded-xl" />
    </div>
  );
};

export default DashboardLoading;
