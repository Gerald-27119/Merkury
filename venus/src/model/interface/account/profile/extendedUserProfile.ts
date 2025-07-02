import UserProfile from "./userProfile";

export default interface ExtendedUserProfile {
    profile: UserProfile;
    isFriends: boolean;
    isFollowing: boolean;
    isOwnProfile: boolean;
}
