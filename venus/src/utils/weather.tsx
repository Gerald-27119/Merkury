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
    });
    return formatter.format(now);
}

export function formatISOToAmPm(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    date.setHours(date.getHours() + 2);
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return formatter.format(date);
}

const weatherAdjectives: Record<number, string> = {
    0: "Sunny",
    1: "Cloudy",
    2: "Cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Foggy",
    51: "Drizzly",
    53: "Drizzly",
    55: "Drizzly",
    56: "Freezing",
    57: "Freezing",
    61: "Rainy",
    63: "Rainy",
    65: "Rainy",
    66: "Freezing",
    67: "Freezing",
    71: "Snowy",
    73: "Snowy",
    75: "Snowy",
    77: "Snowy",
    80: "Showery",
    81: "Showery",
    82: "Showery",
    85: "Showery",
    86: "Showery",
    95: "Thundery",
    96: "Thundery",
    99: "Thundery",
};

export function getWeatherAdjective(code: number): string {
    return weatherAdjectives[code] || "weather";
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
}): SpotWeatherTimelinePlotData[] {
    return data.time.map((time, index) => ({
        time: time,
        temperature: data.temperature_2m[index],
        weatherCode: data.weather_code[index],
        precipitationProbability: data.precipitation_probability[index],
    }));
}
