import SocialCard from "./SocialCard";
import { Social } from "../../../../model/interface/account/social/social";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";

interface SocialCardsProps {
  list: Social[] | undefined;
  type: SocialListType;
}

export default function SocialCardList({ list, type }: SocialCardsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 lg:mx-27">
      {list?.map((f) => <SocialCard friend={f} key={f.username} type={type} />)}
    </div>
  );
}
