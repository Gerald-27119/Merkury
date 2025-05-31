import axios from "axios";
import UserProfile from "../model/interface/account/profile/userProfile";
import { Social } from "../model/interface/account/social/social";
import { EditUserFriendsType } from "../model/enum/account/social/editUserFriendsType";
import { FavoriteSpot } from "../model/interface/account/favorite-spots/favoriteSpot";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getUserProfile(): Promise<UserProfile> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/profile`, {
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
  type: EditUserFriendsType;
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
  type: EditUserFriendsType;
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

export async function getAllUserFavoriteSpots(): Promise<FavoriteSpot[]> {
  return (
    await axios.get(`${BASE_URL}/user-dashboard/spots`, {
      withCredentials: true,
    })
  ).data;
}
