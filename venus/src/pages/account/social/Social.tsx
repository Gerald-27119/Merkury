import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";
import SocialButton from "./components/SocialButton";
import { useState } from "react";
import SocialCardList from "./components/SocialCardList";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";

const menuTypes = [
  { label: "friends", type: SocialListType.FRIENDS },
  { label: "followed", type: SocialListType.FOLLOWED },
  { label: "followers", type: SocialListType.FOLLOWERS },
];

export default function Social() {
  const [type, setType] = useState(SocialListType.FRIENDS);

  const { data: friends } = useQuery({
    queryFn: getUserFriends,
    queryKey: ["friends"],
  });

  const { data: followed } = useQuery({
    queryFn: getUserFollowed,
    queryKey: ["followed"],
  });

  const { data: followers } = useQuery({
    queryFn: getUserFollowers,
    queryKey: ["followers"],
  });

  const dataMap = {
    [SocialListType.FRIENDS]: friends,
    [SocialListType.FOLLOWED]: followed,
    [SocialListType.FOLLOWERS]: followers,
  };

  return (
    <AccountWrapper variant={AccountWrapperType.SOCIAL}>
      <AccountTitle text="social list" />
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
    </AccountWrapper>
  );
}
