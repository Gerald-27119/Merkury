import CategoryDto from "../CategoryDto";
import TagDto from "../TagDto";

export default interface PostDto {
  title: String;
  content: String;
  category: CategoryDto;
  tags: TagDto[];
}
