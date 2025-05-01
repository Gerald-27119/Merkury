package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import net.sf.geographiclib.Geodesic;
import net.sf.geographiclib.PolygonArea;
import net.sf.geographiclib.PolygonResult;

public class PolygonAreaCalculator {
    /**
     * @param points must be added in clockwise or counterclockwise orders
     * @return area in square meters
     */
    public static double calculateArea(BorderPoint[] points) {
        int n = points.length;
        PolygonArea pa = new PolygonArea(Geodesic.WGS84, false);
        for (int i = 0; i < n - 1; i++) {
            BorderPoint point = points[i];
            pa.AddPoint(point.getX(), point.getY());
        }
        PolygonResult res = pa.Compute(false, true);
        return Math.abs(res.area);
    }
}
