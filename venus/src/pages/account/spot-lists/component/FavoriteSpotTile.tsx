import { FavoriteSpot } from "../../../../model/interface/account/favorite-spots/favoriteSpot";
import { FaEye, FaMapMarkedAlt, FaRegTrashAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ConfigProvider, Rate } from "antd";
import { LuInfo } from "react-icons/lu";
import FavoriteSpotTags from "./FavoriteSpotTags";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavoriteSpot } from "../../../../http/user-dashboard";
import { FavoriteSpotsListType } from "../../../../model/enum/account/favorite-spots/favoriteSpotsListType";
import Button from "../../../../components/buttons/Button";
import { ButtonVariantType } from "../../../../model/enum/buttonVariantType";

interface FavoriteSpotTileProps {
  spot: FavoriteSpot;
  selectedType: FavoriteSpotsListType;
}

export default function FavoriteSpotTile({
  spot,
  selectedType,
}: FavoriteSpotTileProps) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: removeFavoriteSpot,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["favorite-spots", selectedType],
      });
    },
  });

  const handleRemoveSpot = async () => {
    await mutateAsync({ type: spot.type, spotId: spot.id });
  };

  return (
    <li className="dark:bg-darkBgSoft bg-lightBgSoft flex h-fit w-full flex-col rounded-md shadow-md md:w-96 lg:h-96 lg:w-full lg:flex-row">
      <img
        src={spot.imageUrl}
        alt={spot.name}
        className="aspect-square h-1/2 rounded-t-md lg:h-full xl:rounded-t-none xl:rounded-l-md"
      />
      <div className="flex w-full flex-col space-y-4 p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-lg">
            <FaEye />
            <p>{spot.viewsCount}</p>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <FaLocationDot className="text-red-500" />
            <p>
              {spot.city}, {spot.country}
            </p>
          </div>
        </div>
        <div className="h-full space-y-4">
          <ConfigProvider
            theme={{
              components: {
                Rate: {
                  starBg: "#aaaaab",
                },
              },
            }}
          >
            <Rate
              allowHalf
              value={spot.rating}
              disabled
              className="text-red-500 accent-amber-800"
            />
          </ConfigProvider>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{spot.name}</h1>
            <FavoriteSpotTags tags={spot.tags} />
          </div>
          <span>{spot.description}</span>
        </div>
        <div className="flex flex-wrap items-end justify-end gap-3 text-xl lg:flex-nowrap lg:space-x-3">
          {/*Todo pomyścleć co robić po wciśnięciu tego przycisku*/}
          <Button
            variant={ButtonVariantType.FAVORITE_SPOT_TILE}
            onClick={() => {}}
          >
            <LuInfo className="text-2xl" />
            <p>More details</p>
          </Button>
          {/*Todo dodac obslugę przycisku*/}
          <Button
            variant={ButtonVariantType.FAVORITE_SPOT_TILE}
            onClick={() => {}}
          >
            <FaMapMarkedAlt className="text-2xl" />
            <p>See on map</p>
          </Button>
          <Button
            onClick={handleRemoveSpot}
            variant={ButtonVariantType.FAVORITE_SPOT_TILE}
          >
            <FaRegTrashAlt className="text-2xl" />
            <p>Remove</p>
          </Button>
        </div>
      </div>
    </li>
  );
}
