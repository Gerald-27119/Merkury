import axios from "axios";
import SpotCoordinatesDto from "../model/interface/spot/coordinates/spotCoordinatesDto";

export async function getBasicSpotWeather(spotCoordinates: SpotCoordinatesDto) {
    return (
        await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude: spotCoordinates.y,
                longitude: spotCoordinates.x,
                hourly: ["temperature_2m", "wind_speed_10m"],
                wind_speed_unit: "ms",
            },
        })
    ).data;
}

export async function fetchWeather(latitude, longitude) {
    return (
        await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude,
                longitude,
                current: ["temperature_2m", "weather_code"],
                hourly: [
                    "wind_speed_1000hPa",
                    "wind_speed_975hPa",
                    "wind_speed_950hPa",
                    "wind_speed_925hPa",
                    "wind_speed_900hPa",
                    "wind_speed_850hPa",
                    "wind_speed_800hPa",
                    "wind_speed_10m",
                    "wind_speed_80m",
                ],
                daily: ["sunrise", "sunset"],
                wind_speed_unit: "ms",
            },
        })
    ).data;
}
