import CategoryDto from "../categoryDto";
import TagDto from "../tagDto";

export default interface PostDto {
  title: string;
  content: string;
  category: CategoryDto;
  tags: TagDto[];
}
