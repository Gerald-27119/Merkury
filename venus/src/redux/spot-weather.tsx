import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SpotWeatherSliceProps = {
    latitude: number;
    longitude: number;
    region: string;
    city: string;
    showBasicWeather: boolean;
    showDetailedWeather: boolean;
};

type SpotCoordinatesPayloadProps = {
    latitude: number;
    longitude: number;
    region: string;
    city: string;
};

const initialState: SpotWeatherSliceProps = {
    latitude: 0,
    longitude: 0,
    region: "",
    city: "",
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
        setSpotCoordinates(
            state,
            action: PayloadAction<SpotCoordinatesPayloadProps>,
        ) {
            state.longitude = action.payload.longitude;
            state.latitude = action.payload.latitude;
            state.region = action.payload.region;
            state.city = action.payload.city;
        },
    },
});

export const spotWeatherActions = spotWeatherSLice.actions;
