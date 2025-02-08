import { useQuery } from "@tanstack/react-query";
import { test } from "../../http/account.js";
import Error from "../../components/error/Error.jsx";

export default function Forum() {
  const { error, isError, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: test,
  });

  if (isLoading) {
    return <p>Loading...</p>;
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
