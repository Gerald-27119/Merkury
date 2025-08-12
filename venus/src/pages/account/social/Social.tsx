import SocialButton from "./components/SocialButton";
import SocialCardList from "./components/SocialCardList";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { SocialDto } from "../../../model/interface/account/social/socialDto";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { socialAction } from "../../../redux/social";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import { MutableRefObject } from "react";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

interface SocialProps {
    friends: SocialDto[];
    followed: SocialDto[];
    followers: SocialDto[];
    photos?: SocialDto[];
    isSocialForViewer: boolean;
    loadMoreRef: MutableRefObject<HTMLDivElement | null>;
    isFetchingNextPage: boolean;
}

export default function Social({
    friends,
    followed,
    followers,
    photos,
    isSocialForViewer,
    loadMoreRef,
    isFetchingNextPage,
}: SocialProps) {
    const type = useSelectorTyped((state) => state.social.type);
    const dispatch = useDispatchTyped();

    const setType = (type: SocialListType) => {
        dispatch(socialAction.setType(type));
    };

    const dataMap = {
        [SocialListType.FRIENDS]: friends,
        [SocialListType.FOLLOWED]: followed,
        [SocialListType.FOLLOWERS]: followers,
        [SocialListType.PHOTOS]: photos,
    };

    const menuTypes = [
        { label: "friends", type: SocialListType.FRIENDS },
        { label: "followed", type: SocialListType.FOLLOWED },
        { label: "followers", type: SocialListType.FOLLOWERS },
        ...(isSocialForViewer
            ? [{ label: "photos", type: SocialListType.PHOTOS }]
            : []),
    ];

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
            <SocialCardList
                list={dataMap[type] ?? []}
                type={type}
                isSocialForViewer={isSocialForViewer}
            />
            <div ref={loadMoreRef} className="h-10" />
            {isFetchingNextPage && <LoadingSpinner />}
        </AccountWrapper>
    );
}
