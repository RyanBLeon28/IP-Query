import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import "../pages/dashboard.css"; 
import { Link, Outlet, useOutletContext } from 'react-router-dom';

// Funções de request
import { checkIp } from "../requests/AbuseIPsCheck";
import { getIpInfo } from "../requests/GetIPInfo";

export default function DataLayout() {
  const fileInputRef = useRef(null);
  const [monitoredIps, setMonitoredIps] = useState([]);
  const [suspectsIps, setSuspectsIps] = useState([]);
  const [ipInfoMap, setIpInfoMap] = useState({});
  const [fileName, setFileName] = useState("");
  const [loadingSuspects, setLoadingSuspects] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [filter, setFilter] = useState("Todos");

  const handleLocationFound = (coords) => {
    setMarkerPosition(coords);
  };

  useEffect(() => {
    const fetchData = async () => {
      const newIpInfoMap = { ...ipInfoMap };
      for (const ip of monitoredIps) {
        if (!newIpInfoMap[ip]) {
          const info = await getIpInfo(ip);
          if (info?.country) {
            newIpInfoMap[ip] = { country: info.country, accessCount: 1 };
          }
        } else {
          newIpInfoMap[ip].accessCount += 1;
        }
      }
      setIpInfoMap(newIpInfoMap);
    };

    if (monitoredIps?.length) fetchData();
  }, [monitoredIps]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
     const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type !== "text/plain") {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const ips = content.split('\n').map(ip => ip.trim()).filter(ip => ip !== "");
      
      console.log("[DataLayout] Arquivo lido. IPs monitorados:", ips.length);
      setMonitoredIps(ips);

    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchSuspects = async () => {
       if (monitoredIps.length === 0) return;

      setLoadingSuspects(true);
      const results = [];
      const uniqueIps = [...new Set(monitoredIps)];
      for (const ip of uniqueIps) {
        const result = await checkIp(ip);
        results.push(result);
      }

      const suspects = results
        .filter(r => r.score >= 80)
        .map(r => r.ip);

      console.log("[DataLayout] Verificação de suspeitos concluída:", suspects);
      setSuspectsIps([...new Set(suspects)]);
      setLoadingSuspects(false);
    };

    fetchSuspects();
  }, [monitoredIps]);

  return (
    <div className="dashboard">
      <header>
        <h1>IP QUERY</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/graphics">Gráficos</Link>
        </nav>
        <Menu className="menu-icon" />
      </header>
      
      <Outlet
        context={{
          monitoredIps,
          suspectsIps,
          ipInfoMap,
          fileName,
          loadingSuspects,
          markerPosition,
          filter,
          setFilter,
          handleLocationFound,
          handleClick,
          fileInputRef,
          handleFileChange,
        }}
      />
    </div>
  );
}

export function useIpData() {
  return useOutletContext();
}