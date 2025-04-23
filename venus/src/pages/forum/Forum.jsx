import { useQuery } from "@tanstack/react-query";
import { test } from "../../http/account.ts";
import Error from "../../components/error/Error.jsx";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner.jsx";

export default function Forum() {
  const { error, isError, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: test,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <div className="h-screen">
      <p>Forum</p>
    </div>
  );
}
