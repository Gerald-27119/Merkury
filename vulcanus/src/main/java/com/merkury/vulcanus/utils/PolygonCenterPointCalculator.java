package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.model.embeddable.BorderPoint;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class PolygonCenterPointCalculator {
    private PolygonCenterPointCalculator() {
    }

    /**
     * Calculates the centroid (geometric center) of a polygon defined by a list of BorderPoint objects.
     * <p>
     * If the polygon is closed (the first and last points are the same), the last point is removed
     * before calculation to avoid counting it twice.
     * <p>
     * The centroid is calculated as the arithmetic mean of the latitude (X) and longitude (Y) coordinates.
     *
     * @param originalPoints List of BorderPoint representing the vertices of the polygon.
     * @return A BorderPoint representing the centroid of the polygon.
     */
    public static BorderPoint calculateCenterPoint(List<BorderPoint> originalPoints){
        List<BorderPoint> points = new ArrayList<>(originalPoints);

        if (!points.isEmpty() && Objects.equals(points.getFirst().getX(), points.getLast().getX())
                && Objects.equals(points.getFirst().getY(), points.getLast().getY())) {
            points.removeLast();
        }

        double sumLat = 0.0;
        double sumLon = 0.0;

        for (BorderPoint point : points) {
            sumLat += point.getX();
            sumLon += point.getY();
        }

        int totalPoints = points.size();
        return new BorderPoint(sumLat / totalPoints, sumLon / totalPoints);
    }
}
