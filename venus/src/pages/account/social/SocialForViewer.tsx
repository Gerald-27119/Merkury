import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";
import Social from "./Social";

export default function SocialForViewer() {
  const { data: friends } = useQuery({
    queryFn: getUserFriends,
    queryKey: ["friends"],
  });

  const { data: followed } = useQuery({
    queryFn: getUserFollowed,
    queryKey: ["followed"],
  });

  const { data: followers } = useQuery({
    queryFn: getUserFollowers,
    queryKey: ["followers"],
  });

  return (
    <Social
      friends={friends ?? []}
      followed={followed ?? []}
      followers={followers ?? []}
      isSocialForViewer={true}
    />
  );
}
