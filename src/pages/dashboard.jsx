import React, {useEffect, useRef, useState} from "react";
import { Menu, Folder } from "lucide-react";
import "./dashboard.css";
import WorldMap from "../components/WorldMap";
import ClientIPInput from "../components/ClientIPInput";
import SuspectsList from "../components/SuspectList";
import Chart from "../components/Chart";

import { getIpInfo } from "../requests/GetIPInfo";
import { checkIpList } from "../requests/CheckIPList";

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const [monitoredIps, setMonitoredIps] = useState([]);
  const [suspectsIps, setSuspectsIps] = useState([]);
  const [ipInfoMap, setIpInfoMap] = useState({});
  const [fileName, setFileName] = useState("");
  const [loadingSuspects, setLoadingSuspects] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [filter, setFilter] = useState("Todos");

  const handleLocationFound = (coords) => {
    // coords será um array como [40.7xx128, -74.0060]
    setMarkerPosition(coords);
  };


  // -------------- Filter IP for map --------------
  useEffect(() => {
  const fetchData = async () => {
    if (monitoredIps.length === 0) {
      setIpInfoMap({}); 
      return;
    }
    
    const infoList = await getIpInfo(monitoredIps);

    const newIpInfoMap = {};
    
    for (const info of infoList) {
      if (info && info.country) { 
        
        const ipOriginalDaLista = info.query; 
        
        if (!newIpInfoMap[ipOriginalDaLista]) {
          newIpInfoMap[ipOriginalDaLista] = { 
            ...info, // Copia todos os dados (city, loc, region, country...)
            accessCount: 1 
          };

        } else {
          newIpInfoMap[ipOriginalDaLista].accessCount += 1;
        }
      }
    }

    setIpInfoMap(newIpInfoMap);
  };

  fetchData();
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
      setMonitoredIps(ips);
    };
    reader.readAsText(file);
  };

  // -------------- Suspects IPs verification --------------
    useEffect(() => {
    const fetchSuspects = async () => {
      if (monitoredIps.length === 0) {
        setSuspectsIps([]);
        return;
      }

      setLoadingSuspects(true);

      const results = await checkIpList(monitoredIps);

      // console.log("Resultado da lista: ",results)
      const suspects = results
        .filter(r => r.score >= 80) // 'score' agora é o 'finalScore'
        .map(r => r.ip);

      setSuspectsIps([...new Set(suspects)]);
      setLoadingSuspects(false);
    };

    fetchSuspects();
  }, [monitoredIps]);

  // ----------- Real Suspect data ----------- 
  // const suspectsSet = new Set(suspectsIps);

  // const chartData = Object.entries(ipInfoMap)
  //   .filter(([ip, info]) => suspectsSet.has(ip)) 
  //   .map(([ip, info]) => ({ // Mapeia apenas os suspeitos
  //     ip: ip,
  //     acessos: info.accessCount,
  //   }));
  // --------------------------------------------
  // ------- Gerar 50 dados para plotar no grafico -------
  const mockChartData = [];
  for (let i = 1; i <= 50; i++) {
    let acessos;
    
    if (i % 8 === 0) { 
      acessos = Math.floor(Math.random() * 150) + 250; // Valores entre 250-400
    } 
    else if (i % 3 === 0) { 
      acessos = Math.floor(Math.random() * 100) + 100; // Valores entre 100-200
    } 
    else { 
      acessos = Math.floor(Math.random() * 70) + 10;  // Valores entre 10-80
    }

    mockChartData.push({
      ip: `198.51.100.${i}`,
      acessos: acessos,
    });
  }
  const chartData = mockChartData;

  // --------------------------------------------

  
  return (
    <div className="dashboard">
      <header>
        <h1>IP QUERY</h1>
        <Menu className="menu-icon" />
      </header>

      <main>
        <section>
          <div className="map-container">
            <div className="map-header">
              <h2>Posição geográfica dos acessos</h2>
              
              {/* Filtro de IPs do mapa */}
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
              {/* Mapa com cores para sinalizar países com mais acessos */}
              <WorldMap 
                markerPosition={markerPosition}
                monitoredIps={monitoredIps}
                suspectsIps={suspectsIps}
                filter={filter}
                ipInfoMap={ipInfoMap} 
              />
            </div>

          </div>

          {/* Grafico para visualização dos dados */}
          <Chart data={chartData} />
        </section>

        <aside>
          {/* Seção de input para encontrar um IP ou DNS no mapa*/}
          <ClientIPInput 
            onLocationFound={handleLocationFound}
            className="self-end w-full max-w-sm"
          />
          
          {/* Seção para adicionar arquivo com lista de IPs */}
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

          {/* Lista de IPs detectados como suspeitos */}
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
