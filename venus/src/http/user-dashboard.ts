import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { Social } from "../model/interface/account/social/social";
import { UserRelationEditType } from "../model/enum/account/social/userRelationEditType";
import ExtendedUserProfile from "../model/interface/account/profile/extendedUserProfile";
import PhotosWithDate from "../model/interface/account/photos/photosWithDate";
import { PhotosSortType } from "../model/enum/account/photos/photosSortType";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getUserOwnProfile(): Promise<UserProfile> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/profile`, {
      withCredentials: true,
    })
  ).data;
}

export async function getProfileForViewer(
  username: string,
): Promise<ExtendedUserProfile> {
  return (
    await axios.get(`${BASE_URL}/public/user-dashboard/profile/${username}`, {
      withCredentials: true,
    })
  ).data;
}

export async function getUserFriends(): Promise<Social[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/friends`, {
      withCredentials: true,
    })
  ).data;
}

interface EditUserFriendsProps {
  friendUsername: string;
  type: UserRelationEditType;
}

export async function editUserFriends({
  friendUsername,
  type,
}: EditUserFriendsProps): Promise<void> {
  return (
    await axios.patch(
      `${BASE_URL}/user-dashboard/friends?friendUsername=${friendUsername}&type=${type}`,
      {},
      {
        withCredentials: true,
      },
    )
  ).data;
}

export async function getUserFollowed(): Promise<Social[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/followed`, {
      withCredentials: true,
    })
  ).data;
}

export async function getUserFollowers(): Promise<Social[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/followers`, {
      withCredentials: true,
    })
  ).data;
}

interface EditUserFollowedProps {
  followedUsername: string;
  type: UserRelationEditType;
}

export async function editUserFollowed({
  followedUsername,
  type,
}: EditUserFollowedProps): Promise<void> {
  return (
    await axios.patch(
      `${BASE_URL}/user-dashboard/followed?followedUsername=${followedUsername}&type=${type}`,
      {},
      {
        withCredentials: true,
      },
    )
  ).data;
}

interface GetSortedUserPhotosProps {
  type: PhotosSortType;
  from: string;
  to: string;
}

export async function getSortedUserPhotos({
  type,
  from,
  to,
}: GetSortedUserPhotosProps): Promise<PhotosWithDate[]> {
  return (
    await axios.get(
      `${BASE_URL}/user-dashboard/photos?type=${type}&from=${from}&to=${to}`,
      {
        withCredentials: true,
      },
    )
  ).data;
}
