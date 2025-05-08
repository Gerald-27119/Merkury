import FriendCard from "./components/FriendCard";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";

export default function Friends() {
  const username = useSelectorTyped((state) => state.account.username);

  const { data } = useQuery({
    queryFn: () => getUserFriends(username),
    queryKey: ["friends", username],
  });

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText flex h-full w-full flex-col space-y-8 p-10">
      <h1 className="ml-27 text-4xl font-semibold capitalize">friends list</h1>
      <div className="flex flex-wrap items-center justify-center gap-5">
        {data?.map((f) => <FriendCard friend={f} key={f.username} />)}
      </div>
    </div>
  );
}
