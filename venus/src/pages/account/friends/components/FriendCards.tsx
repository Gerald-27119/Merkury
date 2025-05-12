import FriendCard from "./FriendCard";
import { Friend } from "../../../../model/interface/account/friends/friend";
import { FriendsListType } from "../../../../model/enum/account/friends/friendsListType";

interface FriendCardsProps {
  list: Friend[] | undefined;
  type: FriendsListType;
}

export default function FriendCards({ list, type }: FriendCardsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 lg:mx-27">
      {list?.map((f) => <FriendCard friend={f} key={f.username} type={type} />)}
    </div>
  );
}
