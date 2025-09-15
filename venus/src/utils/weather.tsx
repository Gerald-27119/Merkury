import SpotWeatherTimelinePlotData from "../model/interface/spot/weather/spotWeatherTimelinePlotData";

export function getWeatherData(data) {
    const date = new Date();
    const currentDay = date.getUTCDay();
    const currentHour = date.getHours();
    const hourInWeek = currentHour * (currentDay + 1);

    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    return {
        temperature: current.temperature_2m,
        weatherCode: current.weather_code,
        winds: [
            { height: 10, speed: hourly.wind_speed_10m[hourInWeek] },
            { height: 80, speed: hourly.wind_speed_80m[hourInWeek] },
            { height: 110, speed: hourly.wind_speed_1000hPa[hourInWeek] },
            { height: 320, speed: hourly.wind_speed_975hPa[hourInWeek] },
            { height: 500, speed: hourly.wind_speed_950hPa[hourInWeek] },
            { height: 800, speed: hourly.wind_speed_925hPa[hourInWeek] },
            { height: 1000, speed: hourly.wind_speed_900hPa[hourInWeek] },
            { height: 1500, speed: hourly.wind_speed_850hPa[hourInWeek] },
            { height: 1900, speed: hourly.wind_speed_800hPa[hourInWeek] },
        ],
        sunrise: formatTime(daily.sunrise[currentDay]),
        sunset: formatTime(daily.sunset[currentDay]),
    };
}

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export function calculateWindSpeed(winds, windHeight) {
    if (winds) {
        const lower = winds
            .filter((wind) => wind.height <= windHeight.numberValue)
            .pop();
        const upper = winds.find(
            (wind) => wind.height > windHeight.numberValue,
        );

        if (lower && upper) {
            const interpolatedSpeed =
                lower.speed +
                ((windHeight.numberValue - lower.height) /
                    (upper.height - lower.height)) *
                    (upper.speed - lower.speed);

            return interpolatedSpeed.toPrecision(2);
        } else if (lower) {
            return lower.speed.toPrecision(2);
        } else if (upper) {
            return upper.speed.toPrecision(2);
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

//TODO: delete and replace with function formatISOToAmPmIntl
export function getCurrentTime(): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return formatter.format(now);
}

export function formatISOToAmPm(isoTimestamp: string): string {
    const date = new Date(
        isoTimestamp.endsWith("Z") ? isoTimestamp : isoTimestamp + "Z",
    );
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return formatter.format(date);
}

const weatherAdjectives: Record<number, string[]> = {
    0: ["Starry Night", "Sunny"],
    1: ["Partly Cloudy", "Partly Cloudy"],
    2: ["Partly Cloudy", "Partly Cloudy"],
    3: ["Cloudy", "Cloudy"],
    45: ["Foggy", "Foggy"],
    48: ["Foggy", "Foggy"],
    51: ["Drizzly", "Drizzly"],
    53: ["Drizzly", "Drizzly"],
    55: ["Drizzly", "Drizzly"],
    56: ["Freezing", "Freezing"],
    57: ["Freezing", "Freezing"],
    61: ["Rainy", "Rainy"],
    63: ["Rainy", "Rainy"],
    65: ["Rainy", "Rainy"],
    66: ["Freezing", "Freezing"],
    67: ["Freezing", "Freezing"],
    71: ["Snowy", "Snowy"],
    73: ["Snowy", "Snowy"],
    75: ["Snowy", "Snowy"],
    77: ["Snowy", "Snowy"],
    80: ["Showery", "Showery"],
    81: ["Showery", "Showery"],
    82: ["Showery", "Showery"],
    85: ["Showery", "Showery"],
    86: ["Showery", "Showery"],
    95: ["Thundery", "Thundery"],
    96: ["Thundery", "Thundery"],
    99: ["Thundery", "Thundery"],
};

export function getWeatherAdjective(code: number, isDay: number): string {
    return weatherAdjectives[code][isDay] || "weather";
}

export function getUvIndexTextLevel(uvIndex: number): string {
    const thresholds = [
        { limit: 3, label: "Low" },
        { limit: 6, label: "Moderate" },
        { limit: 8, label: "High" },
        { limit: 11, label: "Very High" },
    ];
    const found = thresholds.find((t) => uvIndex < t.limit);
    return found ? found.label : "Extreme";
}

export function getTimeIndex(times: string[]): number {
    const now = new Date();
    now.setUTCMinutes(0, 0, 0);
    const formattedDate = now.toISOString().slice(0, 16);
    return times.findIndex((t) => t === formattedDate);
}

export function getISO8601Time(daysToAdd: number = 0): string {
    const now = new Date();
    now.setMinutes(0);
    if (daysToAdd !== 0) {
        now.setDate(now.getDate() + daysToAdd);
    }
    return now.toISOString().slice(0, 16);
}

export function parseWeatherData(data: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
}): SpotWeatherTimelinePlotData[] {
    return data.time.map((time, index) => ({
        time: time,
        temperature: data.temperature_2m[index],
        weatherCode: data.weather_code[index],
        precipitationProbability: data.precipitation_probability[index],
        isDay: data.is_day[index],
    }));
}
