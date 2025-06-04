import Social from "./Social";
import { useQuery } from "@tanstack/react-query";
import {
  getUserFollowed,
  getUserFollowers,
  getUserFriends,
} from "../../../http/user-dashboard";

export default function UserOwnSocial() {
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
    />
  );
}
