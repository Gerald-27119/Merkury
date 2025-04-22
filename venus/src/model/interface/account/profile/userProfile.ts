import { Image } from "./image";

export default interface UserProfile {
  username: string;
  profilePhoto: string;
  followersCount: number;
  followedCount: number;
  friendsCount: string;
  photosCount: string;
  mostPopularPhotos: Image[];
}
