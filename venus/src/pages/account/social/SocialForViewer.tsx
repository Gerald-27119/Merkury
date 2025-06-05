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

  const { data: friends, isLoading } = useQuery({
    queryFn: () => getUserFriendsForViewer(username!),
    queryKey: ["friends", username],
  });

  // const { data: followed } = useQuery({
  //   queryFn: () => getUserFollowedForViewer(username!),
  //   queryKey: ["followed", username],
  // });
  //
  // const { data: followers } = useQuery({
  //   queryFn: () => getUserFollowersForViewer(username!),
  //   queryKey: ["followers", username],
  // });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  console.log(friends);
  return (
    <Social
      friends={friends ?? []}
      followed={[]}
      followers={[]}
      isSocialForViewer={true}
    />
  );
}
