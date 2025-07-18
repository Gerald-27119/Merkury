import RatingFromForm from "./RatingFromForm";
import SpotsSortingForm from "../SpotsSortingForm";
import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import useDispatchTyped from "../../../../hooks/useDispatchTyped";
import { currentViewSpotsActions } from "../../../../redux/current-view-spots";
import { currentViewSpotParamsActions } from "../../../../redux/current-view-spot-params";
import { SpotSortingFormVariantType } from "../../../../model/enum/spot/spotSortingFormVariantType";
import CurrentViewSpotsNameSearchBar from "./CurrentViewSpotsNameSearchBar";

export default function CurrentViewSpotsFormsContainer() {
    const { swLng, swLat, neLng, neLat, name, sorting, ratingFrom } =
        useSelectorTyped((state) => state.currentViewSpotsParams);

    const dispatch = useDispatchTyped();
    return (
        <div className="flex flex-col items-center justify-center">
            <CurrentViewSpotsNameSearchBar />
            <div className="mt-2.5 flex items-center justify-between space-x-4">
                <SpotsSortingForm
                    queryKeyToRemoveQueries={[
                        "current-view-spots",
                        swLng,
                        swLat,
                        neLng,
                        neLat,
                        name,
                        sorting,
                        ratingFrom,
                    ]}
                    onClear={() => {
                        dispatch(
                            currentViewSpotsActions.clearCurrentViewSpots(),
                        );
                    }}
                    onSelectSorting={(opt) => {
                        dispatch(
                            currentViewSpotParamsActions.setParams({
                                sorting: opt.value,
                            }),
                        );
                    }}
                    sorting={sorting}
                    variant={SpotSortingFormVariantType.CURRENT_VIEW}
                />
                <RatingFromForm />
            </div>
        </div>
    );
}
