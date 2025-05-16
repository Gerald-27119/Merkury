import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import SocialButton from "./components/SocialButton";
import { useState } from "react";
import SocialCardList from "./components/SocialCardList";
import { SocialListType } from "../../../model/enum/account/social/socialListType";

const menuTypes = [
  { label: "friends", type: SocialListType.FRIENDS },
  { label: "followed", type: SocialListType.FOLLOWED },
  { label: "followers", type: SocialListType.FOLLOWERS },
];

export default function Social() {
  const username = useSelectorTyped((state) => state.account.username);
  const [type, setType] = useState(SocialListType.FRIENDS);

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
    [SocialListType.FRIENDS]: friends,
    [SocialListType.FOLLOWED]: followed,
    [SocialListType.FOLLOWERS]: followers,
  };

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText flex h-full w-full flex-col space-y-8 p-10 pt-17 xl:pt-10">
      <h1 className="text-4xl font-semibold capitalize lg:ml-27">
        social list
      </h1>
      <div className="flex gap-3 text-2xl lg:mx-27">
        {menuTypes.map(({ label, type: btnType }) => (
          <SocialButton
            key={label}
            onClick={() => setType(btnType)}
            isActive={type === btnType}
          >
            <p className="font-semibold capitalize">{label}</p>
          </SocialButton>
        ))}
      </div>
      <SocialCardList list={dataMap[type]} type={type} />
    </div>
  );
}
