import AccountTitle from "../components/AccountTitle";
import { useQuery } from "@tanstack/react-query";
import { getUserFavoriteSpots } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import FavoriteSpotTile from "./component/FavoriteSpotTile";
import { FavoriteSpotsListType } from "../../../model/enum/account/favorite-spots/favoriteSpotsListType";
import { useState } from "react";

const menuTypes = [
  { label: "All", type: FavoriteSpotsListType.ALL },
  { label: "Favorites", type: FavoriteSpotsListType.FAVORITE },
  { label: "Plan to visit", type: FavoriteSpotsListType.PLAN_TO_VISIT },
  { label: "Visited liked it", type: FavoriteSpotsListType.VISITED_LIED_IT },
  {
    label: "Visited didn't like it",
    type: FavoriteSpotsListType.VISITED_NOT_LIED_IT,
  },
  { label: "Commented by you", type: FavoriteSpotsListType.COMMENTED_BY_YOU },
];

export default function FavoriteSpots() {
  const [selectedType, setSelectedType] = useState(FavoriteSpotsListType.ALL);

  const { data, isLoading } = useQuery({
    queryFn: () => getUserFavoriteSpots(selectedType),
    queryKey: ["favorite-spots", selectedType],
  });

  const handleSetSelectedType = (type: FavoriteSpotsListType) => {
    setSelectedType(type);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dark:bg-darkBg bg-lightBg dark:text-darkText text-lightText h-full w-full space-y-10 p-10 pt-17">
      <AccountTitle text="spots lists" />
      <div className="flex max-w-full gap-5 lg:mx-27">
        {menuTypes.map((m) => (
          <button
            key={m.label}
            onClick={() => handleSetSelectedType(m.type)}
            className={`bg-violetDark hover:bg-violetLight w-full cursor-pointer rounded-md px-1.5 py-2 shadow-md first:mr-15 ${selectedType === m.type ? "bg-violetLight" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="space-y-5 lg:mx-27">
        {data?.map((spot) => <FavoriteSpotTile spot={spot} key={spot.id} />)}
      </div>
    </div>
  );
}
