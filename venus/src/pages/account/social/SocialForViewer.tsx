import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowedForViewer,
  getUserFollowersForViewer,
  getUserFriendsForViewer,
} from "../../../http/user-dashboard";
import Social from "./Social";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import useSelectorTyped from "../../../hooks/useSelectorTyped";
import { SocialListType } from "../../../model/enum/account/social/socialListType";

export default function SocialForViewer() {
  const { username } = useParams();
  const type = useSelectorTyped((state) => state.social.type);

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryFn: () => getUserFriendsForViewer(username!),
    queryKey: ["friends", username],
    enabled: type === SocialListType.FRIENDS,
  });

  const { data: followed, isLoading: isLoadingFollowed } = useQuery({
    queryFn: () => getUserFollowedForViewer(username!),
    queryKey: ["followed", username],
    enabled: type === SocialListType.FOLLOWED,
  });

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryFn: () => getUserFollowersForViewer(username!),
    queryKey: ["followers", username],
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
      // TODO Photos będzie robione w innym zadaniu
      photos={[]}
      isSocialForViewer={true}
    />
  );
}
