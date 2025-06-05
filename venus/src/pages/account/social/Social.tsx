import SocialButton from "./components/SocialButton";
import { useState } from "react";
import SocialCardList from "./components/SocialCardList";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { SocialDto } from "../../../model/interface/account/social/socialDto";
import { ExtendedSocialDto } from "../../../model/interface/account/social/extendedSocialDto";

let menuTypes = [
  { label: "friends", type: SocialListType.FRIENDS },
  { label: "followed", type: SocialListType.FOLLOWED },
  { label: "followers", type: SocialListType.FOLLOWERS },
  { label: "photos", type: SocialListType.PHOTOS },
];

interface SocialProps {
  friends: SocialDto[] | ExtendedSocialDto[];
  followed: SocialDto[];
  followers: SocialDto[];
  photos?: SocialDto[];
  isSocialForViewer?: boolean;
}

export default function Social({
  friends,
  followed,
  followers,
  photos,
  isSocialForViewer,
}: SocialProps) {
  const [type, setType] = useState(SocialListType.FRIENDS);

  let dataMap = {
    [SocialListType.FRIENDS]: friends,
    [SocialListType.FOLLOWED]: followed,
    [SocialListType.FOLLOWERS]: followers,
    [SocialListType.PHOTOS]: photos,
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
