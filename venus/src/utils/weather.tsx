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

export function getCurrentTime(): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    return formatter.format(now);
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
