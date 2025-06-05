import { SocialDto } from "./socialDto";

export interface ExtendedSocialDto {
  social: SocialDto;
  isCurrentlyRelated: boolean;
  isOwnProfile: boolean;
}
