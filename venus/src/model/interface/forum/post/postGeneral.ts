import CategoryDto from "../categoryDto";
import TagDto from "../tagDto";

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
