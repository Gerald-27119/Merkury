import CategoryDto from "./categoryDto";
import TagDto from "./tagDto";

export default interface CategoryAndTagsDto {
  categories: CategoryDto[];
  tags: TagDto[];
}
