package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.model.embeddable.BorderPoint;

public class PolygonAreaCalculator {

    public static double calculateArea(BorderPoint[] points) {
        int n = points.length;
        double area = 0.0;

        for (int i = 0; i < n - 1; i++) {
            BorderPoint current = points[i];
            BorderPoint next = points[i + 1];
            area += (current.getX() * next.getY()) - (next.getX() * current.getY());
        }

        return Math.abs(area) / 2.0;
    }
}
