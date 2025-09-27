export function formatISOToAmPm(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
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

export function getWeatherAdjective(code: number, isDay: boolean): string {
    return weatherAdjectives[code][isDay ? 1 : 0] || "weather";
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
