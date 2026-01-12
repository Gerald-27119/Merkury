import axios from "axios";
import SpotBasicWeatherDto from "../model/interface/spot/weather/spotBasicWeatherDto";
import SpotDetailedWeatherDto from "../model/interface/spot/weather/spotDetailedWeatherDto";
import SpotWeatherWIndSpeedsDto from "../model/interface/spot/weather/spotWeatherWIndSpeedsDto";
import SpotWeatherTimelinePlotData from "../model/interface/spot/weather/spotWeatherTimelinePlotData";
import SpotTimeZoneDto from "../model/interface/spot/weather/spotTimeZoneDto";

const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function getBasicSpotWeather(
    latitude: number,
    longitude: number,
): Promise<SpotBasicWeatherDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/get-spot-basic-weather`, {
            params: {
                latitude,
                longitude,
            },
        })
    ).data;
}

export async function getDetailedSpotWeather(
    latitude: number,
    longitude: number,
): Promise<SpotDetailedWeatherDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/get-spot-detailed-weather`, {
            params: {
                latitude,
                longitude,
            },
        })
    ).data;
}

export async function getWindSpeeds(
    latitude: number,
    longitude: number,
    spotId: number,
): Promise<SpotWeatherWIndSpeedsDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/get-spot-wind-speeds`, {
            params: {
                latitude,
                longitude,
                spotId,
            },
        })
    ).data;
}

export async function getWeatherDataForTimelinePlot(
    latitude: number,
    longitude: number,
    spotId: number,
): Promise<SpotWeatherTimelinePlotData[]> {
    return (
        await axios.get(
            `${BASE_URL}/public/spot/get-spot-weather-timeline-plot-data`,
            {
                params: {
                    latitude,
                    longitude,
                    spotId,
                },
            },
        )
    ).data;
}

export async function getSpotTimeZone(
    spotId: number,
): Promise<SpotTimeZoneDto> {
    return (
        await axios.get(`${BASE_URL}/public/spot/get-spot-time-zone`, {
            params: { spotId },
            withCredentials: true,
        })
    ).data;
}
