import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowedForViewer,
  getUserFollowersForViewer,
  getUserFriendsForViewer,
} from "../../../http/user-dashboard";
import Social from "./Social";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

export default function SocialForViewer() {
  const { username } = useParams();

  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryFn: () => getUserFriendsForViewer(username!),
    queryKey: ["friends", username],
  });

  const { data: followed, isLoading: isLoadingFollowed } = useQuery({
    queryFn: () => getUserFollowedForViewer(username!),
    queryKey: ["followed", username],
  });

  const { data: followers, isLoading: isLoadingFollowers } = useQuery({
    queryFn: () => getUserFollowersForViewer(username!),
    queryKey: ["followers", username],
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
