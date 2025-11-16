"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// ⚠️ Dán token của bạn ở đây
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

export default function Map3D() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12", // có thể đổi sang satellite-v9, dark-v11,...
      center: [105.8342, 21.0278], // Hà Nội
      zoom: 13,
      pitch: 60, // nghiêng để thấy hiệu ứng 3D
      bearing: -17.6,
      antialias: true,
    });

    // Thêm điều khiển zoom/rotation
    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      // Thêm lớp tòa nhà 3D
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-screen" />;
}
