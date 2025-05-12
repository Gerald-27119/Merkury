import FriendCard from "./components/FriendCard";
import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import FriendButton from "./components/FriendButton";
import { useState } from "react";

export default function Friends() {
  const username = useSelectorTyped((state) => state.account.username);
  const [type, setType] = useState("friends");

  const { data: friends } = useQuery({
    queryFn: () => getUserFriends(username),
    queryKey: ["friends", username],
  });

  const { data: followed } = useQuery({
    queryFn: () => getUserFollowed(username),
    queryKey: ["followed", username],
  });

  const { data: followers } = useQuery({
    queryFn: () => getUserFollowers(username),
    queryKey: ["followers", username],
  });

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex h-full w-full flex-col space-y-8 p-10">
      <h1 className="ml-27 text-4xl font-semibold capitalize">friends list</h1>
      <div className="mx-27 flex gap-3 text-2xl">
        <FriendButton onClick={() => setType("friends")}>
          <p className="capitalize">friends</p>
        </FriendButton>
        <FriendButton onClick={() => setType("followed")}>
          <p className="capitalize">followed</p>
        </FriendButton>
        <FriendButton onClick={() => setType("followers")}>
          <p className="capitalize">followers</p>
        </FriendButton>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-5">
        {type === "friends" &&
          friends?.map((f) => <FriendCard friend={f} key={f.username} />)}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5">
        {type === "followed" &&
          followed?.map((f) => <FriendCard friend={f} key={f.username} />)}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5">
        {type === "followers" &&
          followers?.map((f) => <FriendCard friend={f} key={f.username} />)}
      </div>
    </div>
  );
}
