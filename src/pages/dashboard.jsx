import React, {useEffect, useRef, useState} from "react";
import { Menu, Folder, BarChart3, Globe2 } from "lucide-react";
import "./dashboard.css";
import WorldMap from "../components/WorldMap";
import ClientIPInput from "../components/ClientIPInput";
import SuspectsList from "../components/SuspectList";
import Chart from "../components/Chart";

import {checkIp } from "../requests/AbuseIPsCheck"
import { getIpInfo } from "../requests/GetIPInfo";

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const [monitoredIps, setMonitoredIps] = useState([]);
  const [suspectsIps, setSuspectsIps] = useState([]);
  const [ipInfoMap, setIpInfoMap] = useState({});
  const [fileName, setFileName] = useState("");
  const [loadingSuspects, setLoadingSuspects] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [filter, setFilter] = useState("Todos");

  // Função que será chamada pelo IpInput quando uma localização for encontrada
  const handleLocationFound = (coords) => {
    // coords será um array como [40.7128, -74.0060]
    setMarkerPosition(coords);
  };


  // -------------- Filter IP for map --------------
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
  
  // -------------- Receive file text --------------
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type !== "text/plain") {
      const messageBox = document.createElement("div");
      messageBox.textContent = "Apenas arquivos .txt são permitidos!";
      messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 2px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      `;
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const ips = content.split('\n').map(ip => ip.trim()).filter(ip => ip !== "");
      // Aqui o estado 'monitoredIps' é atualizado com a nova lista.
      setMonitoredIps(ips);
    };
    reader.readAsText(file);
  };

  // -------------- Suspects IPs verification --------------
    useEffect(() => {
    const fetchSuspects = async () => {
      if (monitoredIps.length === 0) return;

      setLoadingSuspects(true);
      const results = [];
      for (const ip of monitoredIps) {
        const result = await checkIp(ip);
        results.push(result);
      }

      // Filtra apenas IPs com score alto
      const suspects = results
        .filter(r => r.score >= 80)
        .map(r => r.ip);

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
          <a href="#">Home</a>
          <a href="#">Teste</a>
          <a href="#">Teste</a>
        </nav>
        <Menu className="menu-icon" />
      </header>

      <main>
        <section className="flex gap-4 p-4">

          <div className="map-container">
            <div className="map-header">
              <h2>Posição geográfica dos acessos</h2>
              
              <div className="filters">
                <button
                  className={filter === "Todos" ? "bg-gray-200" : "bg-gray-100"}
                  onClick={() => setFilter("Todos")}
                >
                  Todos
                </button>

                <button
                  className={filter === "Suspeitos" ? "bg-red-500" : "bg-gray-100"}
                  onClick={() => setFilter("Suspeitos")}
                >
                  Suspeitos
                </button>

                <button
                  className={filter === "Saudaveis" ? "bg-green-500" : "bg-gray-100"}
                  onClick={() => setFilter("Saudaveis")}
                >
                  Saudáveis
                </button>
              </div>

            </div>

            <div className="icon-center">
              <WorldMap 
                markerPosition={markerPosition}
                monitoredIps={monitoredIps}
                suspectsIps={suspectsIps}
                filter={filter}
                ipInfoMap={ipInfoMap} 
              />
            </div>
          </div>

          {/* <Chart /> */}
        </section>

        <aside className="w-80 flex flex-col flex-shrink-0 space-y-4">
          <ClientIPInput 
          onLocationFound={handleLocationFound}
          className="self-end w-full max-w-sm"
          />
          
          <div className="list-container">
            <div className="header-list">
              <h2>IPs Monitorados:</h2>
              <p>{monitoredIps.length}</p>

              <div className="block cursor-pointer" onClick={handleClick}>
                <span>Selecionar arquivo</span>
                <Folder />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                style={{ display: "none" }}
              />
            </div>

            <div className="fileName">
              {/* Nome do arquivo e botão remover */}
              {fileName && (
                <div className="file-info" style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{fileName}</span>
                  <button
                    onClick={() => {
                      setMonitoredIps([]);
                      setSuspectsIps([]);
                      setIpInfoMap({});
                      setFileName("");
                      if (fileInputRef.current) fileInputRef.current.value = null;
                    }}
                      style={{
                      padding: "0.2rem 0.5rem",
                      cursor: "pointer",
                      backgroundColor: "#e53e3e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.8rem",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <ul>
              {monitoredIps.length > 0 ? (
                monitoredIps.map((ip, index) => <li key={index}>{ip}</li>)
              ) : (
                <li className="placeholder-text">
                  Adicione a lista de IPs que visitaram seu domínio.
                </li>
              )}
            </ul>
          </div>

          <SuspectsList 
            monitoredIps={monitoredIps}
            suspectsIps={suspectsIps}
            ipInfoMap={ipInfoMap}
            loading={loadingSuspects}
          />
        </aside>

        
      </main>
    </div>
  );
}
