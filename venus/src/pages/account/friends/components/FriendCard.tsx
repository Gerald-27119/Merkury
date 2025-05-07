import { Friend } from "../../../../model/interface/account/friends/friend";
import { BiMessageRounded } from "react-icons/bi";
import { FaUser, FaUserMinus } from "react-icons/fa";

interface FriendCardProps {
  friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="bg-darkBgSoft space-y-2 rounded-md px-3 pt-3 pb-4">
      <img
        src={friend.profilePhoto}
        alt="profile"
        className="mx-6 aspect-square h-56 rounded-full"
      />
      <h3 className="text-center text-xl font-semibold capitalize">
        {friend.username}
      </h3>
      <h5 className="text-darkBorder text-center capitalize">available</h5>
      <div className="flex gap-2 text-3xl">
        <button className="bg-violetDark flex w-full items-center justify-center rounded-md py-1.5">
          <FaUser />
        </button>
        <button className="bg-violetDark flex w-full items-center justify-center rounded-md py-1.5">
          <BiMessageRounded />
        </button>
        <button className="bg-violetDark flex w-full items-center justify-center rounded-md py-1.5">
          <FaUserMinus />
        </button>
      </div>
    </div>
  );
}
