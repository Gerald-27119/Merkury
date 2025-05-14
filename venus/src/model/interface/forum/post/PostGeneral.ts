import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";

export default interface PostGeneral {
  id: number;
  title: string;
  content: string;
  category: CategoryDto;
  tags: TagDto[];
  views: number;
  numberOfComments: number;
  isAuthor: boolean;
}
