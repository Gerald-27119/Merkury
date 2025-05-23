import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesAndTags } from "../../../http/posts";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import Error from "../../../components/error/Error";
import Category from "./Category";
import Tag from "./Tag";

export default function CategoriesTagsPanel({}) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["categoriesAndTags"],
    queryFn: () => fetchCategoriesAndTags(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <div className="dark:bg-darkBgSoft mt-4 w-52 rounded-2xl">
      <div className="p-4">
        <span>Categories</span>
        {data?.categories?.length ? (
          <div className="mt-2 whitespace-nowrap">
            <ul>
              {data.categories.map((category) => (
                <li key={category.id}>
                  <Category category={category} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <span>There are no categories</span>
        )}
      </div>

      <div className="p-4">
        <span>Tags</span>
        {data?.tags?.length ? (
          <div>
            <ul className="mt-4 flex flex-wrap gap-2 gap-y-3">
              {data.tags.map((tag) => (
                <li key={tag.id}>
                  <Tag tag={tag} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <span>There are no tags</span>
        )}
      </div>
    </div>
  );
}
