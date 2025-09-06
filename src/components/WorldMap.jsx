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

export default function WorldMap({ markerPosition, monitoredIps, filter}) {

  const [countryAccess, setCountryAccess] = React.useState({});

  React.useEffect(() => {
    const fetchAccessData = async () => {
      const accessPerCountry = {};

      console.log("Request for IPs list");
      for (const ip of monitoredIps) {
        const info = await getIpInfo(ip);
        if (info?.country) {
          accessPerCountry[info.country] = (accessPerCountry[info.country] || 0) + 1;
        }
      }

      setCountryAccess(accessPerCountry);
    };

    if (monitoredIps?.length) fetchAccessData();
  }, [monitoredIps]);

  const values = Object.values(countryAccess);
  const minAccess = Math.min(...values, 0);
  const maxAccess = Math.max(...values, 1);

  const getColor = (value) => {
    if (isNaN(value) || value === 0) return "#d1d5db";
    const ratio = (value - minAccess) / (maxAccess - minAccess);
    const r = Math.round(34 + ratio * (220 - 34));
    const g = Math.round(197 - ratio * (197 - 38));
    const b = Math.round(94 - ratio * (94 - 38));
    return `rgb(${r},${g},${b})`;
  };

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
      style={{ height: "300px", width: "100%" }}
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
