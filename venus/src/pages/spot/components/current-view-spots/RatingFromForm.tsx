import { ConfigProvider, Rate } from "antd";
import { useState } from "react";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { currentViewSpotsActions } from "../../../../redux/current-view-spots";
import { currentViewSpotParamsActions } from "../../../../redux/current-view-spot-params";
import { useQueryClient } from "@tanstack/react-query";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";

export default function RatingFromForm() {
    const [ratingFromValue, setRatingFromValue] = useState<number>(0);

    const dispatch = useDispatchTyped();

    const queryClient = useQueryClient();

    const { swLng, swLat, neLng, neLat, name, sorting, ratingFrom } =
        useSelectorTyped((state) => state.currentViewSpotsParams);

    const handleOnRateSelect = (value: number) => {
        setRatingFromValue(value);
        dispatch(currentViewSpotParamsActions.setParams({ ratingFrom: value }));
        dispatch(currentViewSpotsActions.clearCurrentViewSpots());
        queryClient.removeQueries({
            queryKey: [
                "current-view-spots",
                swLng,
                swLat,
                neLng,
                neLat,
                name,
                sorting,
                ratingFrom,
            ],
        });
    };

    return (
        <div className="dark:bg-violetLight bg-whiteSmoke text-violetDark z-10 flex items-center rounded-2xl px-2 py-1 drop-shadow-md dark:text-white dark:drop-shadow-none">
            <label className="mr-3 text-lg font-semibold">Rating from:</label>
            <ConfigProvider
                theme={{
                    components: {
                        Rate: {
                            starBg: "#ffffff",
                            starColor: "#fadb14",
                        },
                    },
                }}
            >
                <Rate
                    data-testid="current-view-spots-rating-from-form"
                    allowHalf
                    value={ratingFromValue}
                    onChange={handleOnRateSelect}
                />
            </ConfigProvider>
        </div>
    );
}
