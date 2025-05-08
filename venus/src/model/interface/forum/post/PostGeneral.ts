import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";

export default interface PostGeneral {
  id: number;
  title: String;
  content: String;
  category: CategoryDto;
  tags: String[];
  views: number;
  numberOfComments: number;
  isAuthor: boolean;
}
