import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SpotCoordinatesDto from "../model/interface/spot/coordinates/spotCoordinatesDto";

type SpotWeatherSliceProps = {
    latitude: number;
    longitude: number;
    showBasicWeather: boolean;
    showDetailedWeather: boolean;
};

const initialState: SpotWeatherSliceProps = {
    latitude: 0,
    longitude: 0,
    showBasicWeather: false,
    showDetailedWeather: false,
};

export const spotWeatherSLice = createSlice({
    name: "spotWeather",
    initialState,
    reducers: {
        openBasicWeatherModal(state) {
            state.showBasicWeather = true;
        },
        closeBasicWeatherModal(state) {
            state.showBasicWeather = false;
        },
        openDetailedWeatherModal(state) {
            state.showBasicWeather = false;
            state.showDetailedWeather = true;
        },
        closeDetailedWeatherModal(state) {
            state.showDetailedWeather = false;
            state.showBasicWeather = true;
        },
        closeAllWeatherModals(state) {
            state.showBasicWeather = false;
            state.showDetailedWeather = false;
        },
        setSpotCoordinates(state, action: PayloadAction<SpotCoordinatesDto>) {
            state.longitude = action.payload.x;
            state.latitude = action.payload.y;
        },
    },
});

export const spotWeatherActions = spotWeatherSLice.actions;
