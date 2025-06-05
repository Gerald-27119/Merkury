import Social from "./Social";
import { useQuery } from "@tanstack/react-query";
import {
  getUserOwnFollowed,
  getUserOwnFollowers,
  getUserOwnFriends,
} from "../../../http/user-dashboard";

export default function UserOwnSocial() {
  const { data: friends } = useQuery({
    queryFn: getUserOwnFriends,
    queryKey: ["friends"],
  });

  const { data: followed } = useQuery({
    queryFn: getUserOwnFollowed,
    queryKey: ["followed"],
  });

  const { data: followers } = useQuery({
    queryFn: getUserOwnFollowers,
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
