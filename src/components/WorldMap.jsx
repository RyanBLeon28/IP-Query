import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countriesData from "../assets/countries.json";
import accessData from "../assets/accessData.json"; 

export default function WorldMap() {
  const countryAccess = {};
  accessData.forEach((item) => {
    countryAccess[item.country] = (countryAccess[item.country] || 0) + item.access;
  });

  const values = Object.values(countryAccess);
  const minAccess = Math.min(...values);
  const maxAccess = Math.max(...values);

  const getColor = (value) => {
    if (isNaN(value) || value === 0) return "#d1d5db"; // cinza se sem dados
    const ratio = (value - minAccess) / (maxAccess - minAccess || 1);

    // interpolação RGB de verde (#22c55e) até vermelho (#dc2626)
    const r = Math.round(34 + ratio * (220 - 34));   // de 34 → 220
    const g = Math.round(197 - ratio * (197 - 38));  // de 197 → 38
    const b = Math.round(94 - ratio * (94 - 38));    // de 94 → 38

    return `rgb(${r},${g},${b})`;
  };

  const countryStyle = (feature) => {
    const name = feature.properties.name;
    const access = countryAccess[name] || 0;

    return {
      fillColor: getColor(access),
      fillOpacity: 0.8,
      color: "#fff",
      weight: 1,
    };
  };

  // 🔹 5. Eventos de hover + popup
  const onEachCountry = (country, layer) => {
    const name = country.properties.name;
    const access = countryAccess[name] || 0;

    layer.bindPopup(`${name}<br/>Acessos: ${access}`);

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          ...countryStyle(country),
          fillOpacity: 0.6,
        });
      },
      mouseout: (e) => {
        // Passa o cursor e muda de cor o pais
        // e.target.setStyle(countryStyle(country));
      },
    });
  };

  return (
    <MapContainer
      style={{ height: "500px", width: "100%" }}
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        data={countriesData}
        style={countryStyle}
        onEachFeature={onEachCountry}
      />
    </MapContainer>
  );
}
