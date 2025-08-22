import axios from "axios";

export async function getBasicSpotWeather(latitude: number, longitude: number) {
    return (
        await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude,
                longitude,
                current: ["temperature_2m", "weather_code", "wind_speed_10m"],
                wind_speed_unit: "ms",
            },
        })
    ).data;
}

export async function getDetailedSpotWeather(
    latitude: number,
    longitude: number,
) {
    return (
        await axios.get("https://api.open-meteo.com/v1/forecast", {
            params: {
                latitude,
                longitude,
                current: [
                    "temperature_2m",
                    "weather_code",
                    "precipitation_probability",
                    "dew_point_2m",
                    "relative_humidity_2m",
                ],
                daily: ["uv_index_max"],
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
