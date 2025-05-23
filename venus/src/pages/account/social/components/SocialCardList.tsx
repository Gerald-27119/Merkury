import SocialCard from "./SocialCard";
import { Social } from "../../../../model/interface/account/social/social";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";

interface SocialCardsProps {
  list: Social[] | undefined;
  type: SocialListType;
}

export default function SocialCardList({ list, type }: SocialCardsProps) {
  if (!list || list.length === 0) {
    let message;
    switch (type) {
      case SocialListType.FOLLOWED:
        message = "You're not following anyone yet.";
        break;
      case SocialListType.FOLLOWERS:
        message = "You have no followers yet.";
        break;
      case SocialListType.FRIENDS:
        message = "You have no friends yet.";
        break;
      default:
        message = "Your list is empty.";
    }
    return <p className="mt-10 text-center text-gray-500">{message}</p>;
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-5 lg:mx-27">
      {list?.map((f) => <SocialCard friend={f} key={f.username} type={type} />)}
    </ul>
  );
}
