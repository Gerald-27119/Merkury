import { UserFriendStatus } from "../../../enum/account/social/userFriendStatus";

export interface SocialDto {
    username: string;
    profilePhoto: string;
    commonPrivateChatId: number | null;
    isUserFriend: boolean;
    status?: UserFriendStatus;
}
