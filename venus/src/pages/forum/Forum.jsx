import { useQuery } from "@tanstack/react-query";
import { test } from "../../http/account.js";

export default function Forum() {
  const { isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: test,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen">
      <p>Forum</p>
    </div>
  );
}
