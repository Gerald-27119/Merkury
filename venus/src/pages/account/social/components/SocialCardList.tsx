import SocialCard from "./SocialCard";
import { SocialDto } from "../../../../model/interface/account/social/socialDto";
import { SocialListType } from "../../../../model/enum/account/social/socialListType";

interface SocialCardsProps {
    list: SocialDto[] | undefined;
    type: SocialListType;
    isSocialForViewer: boolean;
    isSearchFriend?: boolean;
}

export default function SocialCardList({
    list,
    type,
    isSocialForViewer,
    isSearchFriend,
}: SocialCardsProps) {
    if (!list || list.length === 0) {
        let message;
        switch (type) {
            case SocialListType.FOLLOWED:
                message = isSocialForViewer
                    ? "This user isn't following anyone yet."
                    : "You're not following anyone yet.";
                break;
            case SocialListType.FOLLOWERS:
                message = isSocialForViewer
                    ? "This user has no followers yet."
                    : "You have no followers yet.";
                break;
            case SocialListType.FRIENDS:
                message = isSocialForViewer
                    ? "This user has no friends yet."
                    : "You have no friends yet.";
                break;
            case SocialListType.PHOTOS:
                message = "This user hasn't added any photos yet.";
                break;
            default:
                message = isSocialForViewer
                    ? "This user's list is empty."
                    : "Your list is empty.";
        }
        if (isSearchFriend) {
            message = "We can't find a user with this username.";
        }
        return (
            <p className="flex h-full items-center justify-center text-center text-lg text-gray-500">
                {message}
            </p>
        );
    }

    return (
        <ul className="flex flex-wrap items-center justify-center gap-5 lg:mx-27">
            {list?.map((f) => (
                <SocialCard
                    friend={f}
                    key={f.username}
                    type={type}
                    isSocialForViewer={isSocialForViewer}
                    isSearchFriend={isSearchFriend}
                />
            ))}
        </ul>
    );
}
