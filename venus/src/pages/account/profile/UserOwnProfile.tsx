import Profile from "./Profile";
import { useQuery } from "@tanstack/react-query";
import { getUserOwnProfile } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";

export default function UserOwnProfile() {
    const { data, isLoading } = useQuery({
        queryFn: getUserOwnProfile,
        queryKey: ["userProfile"],
    });

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return <Profile userData={data!} />;
}
