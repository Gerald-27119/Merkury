import Profile from "./Profile";
import { useQuery } from "@tanstack/react-query";
import { getUserPrivateProfile } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

export default function OwnProfile() {
  const { data, isLoading } = useQuery({
    queryFn: getUserPrivateProfile,
    queryKey: ["userProfile"],
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <Profile userData={data!} />;
}
