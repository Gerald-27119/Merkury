export default interface SpotDetailedWeatherDto {
    temperature: number;
    weatherCode: number;
    precipitationProbability: number;
    dewPoint: number;
    relativeHumidity: number;
    isDay: boolean;
    uvIndexMax: number;
}
