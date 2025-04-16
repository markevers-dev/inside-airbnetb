"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_WIDTH = "600px";
const MAP_HEIGHT = "600px";
const MAP_BORDER_RADIUS = "12px";
const MAP_BOX_SHADOW = "0 0 10px rgba(0,0,0,0.1)";

const Map = ({ listings, styleLink }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleLink,
      center: [12.5683, 55.6761],
      zoom: 11,
    });

    listings.forEach((listing) => {
      new maplibregl.Marker()
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(new maplibregl.Popup().setText(listing.name))
        .addTo(map.current);
    });

    return () => map.current?.remove();
  }, [listings]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        borderRadius: MAP_BORDER_RADIUS,
        boxShadow: MAP_BOX_SHADOW,
      }}
    />
  );
};

export default Map;
