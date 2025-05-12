import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import FriendButton from "./components/FriendButton";
import { useState } from "react";
import FriendCards from "./components/FriendCards";
import { FriendsListType } from "../../../model/enum/account/friends/friendsListType";

const menuTypes = [
  { label: "friends", type: FriendsListType.FRIENDS },
  { label: "followed", type: FriendsListType.FOLLOWED },
  { label: "followers", type: FriendsListType.FOLLOWERS },
];

export default function Friends() {
  const username = useSelectorTyped((state) => state.account.username);
  const [type, setType] = useState(FriendsListType.FRIENDS);

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

  const dataMap = {
    [FriendsListType.FRIENDS]: friends,
    [FriendsListType.FOLLOWED]: followed,
    [FriendsListType.FOLLOWERS]: followers,
  };

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <h1 className="text-4xl font-semibold capitalize lg:ml-27">
        friends list
      </h1>
      <div className="flex gap-3 text-2xl lg:mx-27">
        {menuTypes.map(({ label, type: btnType }) => (
          <FriendButton
            key={label}
            onClick={() => setType(btnType)}
            isActive={type === btnType}
          >
            <p className="font-semibold capitalize">{label}</p>
          </FriendButton>
        ))}
      </div>
      <FriendCards list={dataMap[type]} type={type} />
    </div>
  );
}
