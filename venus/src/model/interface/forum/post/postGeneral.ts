import PostCategoryDto from "../postCategoryDto";
import TagDto from "../../tagDto";

export default interface PostGeneral {
    id: number;
    title: string;
    slugTitle: string;
    summaryContent: string;
    content: string;
    category: PostCategoryDto;
    tags: TagDto[];
    views: number;
    commentsCount: number;
    isAuthor: boolean;
    isFollowed: boolean;
}
