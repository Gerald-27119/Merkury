import Social from "./Social";
import { useQuery } from "@tanstack/react-query";
import {
  getUserOwnFollowed,
  getUserOwnFollowers,
  getUserOwnFriends,
} from "../../../http/user-dashboard";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

export default function UserOwnSocial() {
  const type = useSelectorTyped((state) => state.social.type);

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryFn: getUserOwnFriends,
    queryKey: ["friends"],
    enabled: type === SocialListType.FRIENDS,
  });

  const { data: followed, isLoading: isLoadingFollowed } = useQuery({
    queryFn: getUserOwnFollowed,
    queryKey: ["followed"],
    enabled: type === SocialListType.FOLLOWED,
  });

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryFn: getUserOwnFollowers,
    queryKey: ["followers"],
    enabled: type === SocialListType.FOLLOWERS,
  });

  if (isLoadingFriends || isLoadingFollowed || isLoadingFollowers) {
    return <LoadingSpinner />;
  }

  return (
    <Social
      friends={friends ?? []}
      followed={followed ?? []}
      followers={followers ?? []}
      isSocialForViewer={false}
    />
  );
}
