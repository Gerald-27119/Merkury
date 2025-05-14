import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";

export default interface PostDto {
  title: string;
  content: string;
  category: CategoryDto;
  tags: TagDto[];
}
