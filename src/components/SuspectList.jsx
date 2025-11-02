import React, {useState, useMemo} from "react";
import "./SuspectList.css"
import countriesData from "../assets/countries.json"

export default function SuspectsList({ monitoredIps = [], suspectsIps = [], ipInfoMap = {}, loading }) {
  const [sortField, setSortField] = useState("acessos"); 
  const [sortOrder, setSortOrder] = useState("desc"); 
  
  const countryCodeToNameMap = useMemo(() => {
    const map = {};
    countriesData.features.forEach(feature => {
      const code = feature.properties["ISO3166-1-Alpha-2"]; 
      const name = feature.properties.name;
      if (code && name) {
        map[code] = name;
      }
    });
    map["US"] = "United States of America";
    map["FR"] = "France";
    return map;
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const uniqueIps = Array.from(new Set(suspectsIps));
  const sortedIps = uniqueIps.sort((a, b) => {
    const infoA = ipInfoMap[a] || {};
    const infoB = ipInfoMap[b] || {};

    if (sortField === "acessos") {
      return sortOrder === "asc"
        ? (infoA.accessCount || 1) - (infoB.accessCount || 1)
        : (infoB.accessCount || 1) - (infoA.accessCount || 1);
    } else if (sortField === "pais") {
      const countryA = (infoA.country || "").toUpperCase();
      const countryB = (infoB.country || "").toUpperCase();
      if (countryA < countryB) return sortOrder === "asc" ? -1 : 1;
      if (countryA > countryB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return (
    <div className="list-container">
      <div className="header-suspects">
        <h2>IPs Abusivos:</h2>
        <p>{uniqueIps.length}</p>
      </div>

      {loading ? (
        <p className="placeholder-text">Carregando...</p>
      ) : sortedIps.length > 0 ? (
        <div className="table-wrapper">
          <table className="suspects-table">
            <thead>
              <tr>
                <th>IP</th>
                <th onClick={() => handleSort("acessos")} style={{ cursor: "pointer" }}>
                  Acessos {sortField === "acessos" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("pais")} style={{ cursor: "pointer" }}>
                  País {sortField === "pais" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedIps.map((ip, index) => {
                const info = ipInfoMap[ip] || {};

                const countryName = countryCodeToNameMap[info.country] || "País desconhecido";

                return (
                  <tr key={index}>
                    <td>{ip}</td>
                    <td>{info.accessCount || 1}</td>
                    <td title={countryName}>
                      {info.country || "Desconhecido"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="placeholder-text">Nenhum IP suspeito.</p>
      )}
    </div>
  );
}