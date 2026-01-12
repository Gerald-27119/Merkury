import UserProfile from "./userProfile";
import { UserFriendStatus } from "../../../enum/account/social/userFriendStatus";

export default interface ExtendedUserProfile {
    profile: UserProfile;
    friendStatus: UserFriendStatus;
    isFollowing: boolean;
    isOwnProfile: boolean;
}
