import { useGetAuthStatus } from "@workspace/api-client-react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Admin() {
  const { data, isLoading } = useGetAuthStatus();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-32 w-full max-w-md rounded-xl" />
      </div>
    );
  }

  return data?.isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
