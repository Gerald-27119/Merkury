package com.merkury.vulcanus.utils;

public class MapDistanceCalculator {
    private static final int EARTHS_RADIUS_IN_METERS = 6371000;

    /**
     * @param latitude1   the first point's latitude, in decimal degrees
     * @param longitude1  the first point's longitude, in decimal degrees
     * @param latitude2   the second point's latitude, in decimal degrees
     * @param longitude2  the second point's longitude, in decimal degrees
     * @return distance in kilometres between the two points
     */
    public static double calculateDistance(double latitude1, double longitude1, double latitude2, double longitude2) {
        double lat1Rad = Math.toRadians(latitude1);
        double lat2Rad = Math.toRadians(latitude2);

        double deltaLatRad = Math.toRadians(latitude2 - latitude1);
        double deltaLonRad = Math.toRadians(longitude2 - longitude1);

        double sinHalfDeltaLat = Math.sin(deltaLatRad / 2);
        double sinHalfDeltaLon = Math.sin(deltaLonRad / 2);

        double a = sinHalfDeltaLat * sinHalfDeltaLat
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * sinHalfDeltaLon * sinHalfDeltaLon;

        double angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (EARTHS_RADIUS_IN_METERS * angularDistance) / 1000;
    }
}
