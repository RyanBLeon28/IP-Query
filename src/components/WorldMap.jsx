import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import countriesData from "../assets/countries.json";
import { getIpInfo } from "../requests/GetIPInfo";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export default function WorldMap({ markerPosition, monitoredIps, suspectsIps, filter, ipInfoMap}) {
  const [countryAccess, setCountryAccess] = React.useState({});

  React.useEffect(() => {
    if (!ipInfoMap || !Object.keys(ipInfoMap).length) return;

    let filteredIps = [];

    if (filter === "Todos") {
      filteredIps = Object.keys(ipInfoMap); // todos únicos
    } else if (filter === "Suspeitos") {
      filteredIps = Array.from(new Set(suspectsIps));
    } else if (filter === "Saudaveis") {
      filteredIps = Object.keys(ipInfoMap).filter((ip) => !suspectsIps.includes(ip));
    }

    // For normalize countries names
    const normalizeCountry = {
      "United States": "United States of America"
    };

    const accessPerCountry = {};
    for (const ip of filteredIps) {
      const info = ipInfoMap[ip];
      if (info?.country) {
        const normalizedName = normalizeCountry[info.country] || info.country;
        accessPerCountry[normalizedName] =
          (accessPerCountry[normalizedName] || 0) + (info.accessCount || 1);
      }
    }

    setCountryAccess(accessPerCountry);
  }, [filter, monitoredIps, suspectsIps, ipInfoMap]);

  const values = Object.values(countryAccess);
  const minAccess = Math.min(...values, 0);
  const maxAccess = Math.max(...values, 1);

  const countryColors = {};
  Object.entries(countryAccess).forEach(([country, access]) => {
    const ratio = (access - minAccess) / (maxAccess - minAccess || 1);
    const r = Math.round(34 + ratio * (220 - 34));
    const g = Math.round(197 - ratio * (197 - 38));
    const b = Math.round(94 - ratio * (94 - 38));
    countryColors[country] = `rgb(${r},${g},${b})`;
  });
  
  const onEachCountry = (country, layer) => {
    const name = country.properties.name;
    const fillColor = countryColors[name] || "#d1d5db";

    layer.setStyle({
      fillColor,
      fillOpacity: 0.8,
      color: "#fff",
      weight: 1,
    });

    layer.bindPopup(`${name}<br/>Acessos: ${countryAccess[name] || 0}`);

    layer.on({
      mouseover: (e) => e.target.setStyle({ ...layer.options, fillOpacity: 0.6 }),
      mouseout: (e) => e.target.setStyle({ ...layer.options, fillOpacity: 0.8 }),
    });
  };

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={[20, 0]}
      zoom={1.8}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        key={JSON.stringify(countryAccess)}
        data={countriesData}
        //style={countryStyle}
        onEachFeature={onEachCountry}
      />
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            Localização do domínio/IP pesquisado.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
