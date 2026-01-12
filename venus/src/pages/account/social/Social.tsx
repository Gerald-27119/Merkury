import SocialButton from "./components/SocialButton";
import SocialCardList from "./components/SocialCardList";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import { SocialDto } from "../../../model/interface/account/social/socialDto";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { socialAction } from "../../../redux/social";
import AccountTitle from "../components/AccountTitle";
import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import { MutableRefObject } from "react";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import PhotosList from "./components/PhotosList";
import DatedMediaGroup from "../../../model/interface/account/media/datedMediaGroup";
import EmptyModal from "../../../components/modal/EmptyModal";
import { useBoolean } from "../../../hooks/useBoolean";
import SearchFriendsList from "./components/SearchFriendsList";
import FriendInvitesList from "./components/FriendInvitesList";

interface SocialProps {
    list: SocialDto[] | DatedMediaGroup[];
    isSocialForViewer: boolean;
    loadMoreRef: MutableRefObject<HTMLDivElement | null>;
    isFetchingNextPage: boolean;
    type: SocialListType;
}

export default function Social({
    list,
    isSocialForViewer,
    loadMoreRef,
    isFetchingNextPage,
    type,
}: SocialProps) {
    const dispatch = useDispatchTyped();
    const [isOpen, open, close, _] = useBoolean(false);
    const [isOpenInvites, openInvites, closeInvites, __] = useBoolean(false);

    const setType = (type: SocialListType) => {
        dispatch(socialAction.setType(type));
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
        <>
            <AccountWrapper variant={AccountWrapperType.SOCIAL}>
                <div className="flex items-center justify-between">
                    <AccountTitle text="social list" />
                    <div className="flex items-center gap-x-5">
                        {type === SocialListType.FRIENDS &&
                            !isSocialForViewer && (
                                <SocialButton onClick={openInvites} isWidthFit>
                                    <p className="font-semibold capitalize">
                                        See friend invites
                                    </p>
                                </SocialButton>
                            )}
                        {type === SocialListType.FRIENDS &&
                            !isSocialForViewer && (
                                <SocialButton
                                    onClick={open}
                                    isWidthFit
                                    className="lg:mr-27"
                                >
                                    <p className="font-semibold capitalize">
                                        Add new friend
                                    </p>
                                </SocialButton>
                            )}
                    </div>
                </div>
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
                {type === SocialListType.PHOTOS ? (
                    <PhotosList photos={list as DatedMediaGroup[]} />
                ) : (
                    <SocialCardList
                        list={list as SocialDto[]}
                        type={type}
                        isSocialForViewer={isSocialForViewer}
                    />
                )}
                <div ref={loadMoreRef} className="h-10" />
                {isFetchingNextPage && <LoadingSpinner />}
            </AccountWrapper>
            <EmptyModal onClose={close} isOpen={isOpen} className="h-4/5 w-4/5">
                <SearchFriendsList onClose={close} />
            </EmptyModal>
            <EmptyModal
                onClose={closeInvites}
                isOpen={isOpenInvites}
                className="h-96 w-96"
            >
                <FriendInvitesList onClose={closeInvites} />
            </EmptyModal>
        </>
    );
}
