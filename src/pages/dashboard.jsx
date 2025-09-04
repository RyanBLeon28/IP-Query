import React, {useRef, useState} from "react";
import { Menu, Folder, BarChart3, Globe2 } from "lucide-react";
import "./dashboard.css";
import WorldMap from "../components/WorldMap";
import ClientIPInput from "../components/ClientIPInput";
import Chart from "../components/Chart";

export default function Dashboard() {
  // Estado para armazenar a posição do marcador [latitude, longitude]
  const [markerPosition, setMarkerPosition] = useState(null);
  
  // Função que será chamada pelo IpInput quando uma localização for encontrada
  const handleLocationFound = (coords) => {
    // coords será um array como [40.7128, -74.0060]
    setMarkerPosition(coords);
  };

  const fileInputRef = useRef(null);
  const [monitoredIps, setMonitoredIps] = useState([]);
  const [suspectsIps, setSuspectsIps] = useState([]);


  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  // Esta função é chamada ao selecionar um arquivo de texto.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
        <aside>
          <div className="flex gap-2">
            <ClientIPInput onLocationFound={handleLocationFound}/>
          </div>

          <div className="list-container">
            <div className="header-list">
              <h2>IPs Monitorados:</h2>
              <p>{monitoredIps.length}</p>
              <div className="block cursor-pointer" onClick={handleClick}>
                <span>IPs</span>
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
            <ul>
              {monitoredIps.length > 0 ? (
                monitoredIps.map((ip, index) => (
                  <li key={index}>{ip}</li>
                ))
              ) : (
                <li className="placeholder-text">Adicione a lista de IPs que visitaram seu domínio.</li>
              )}
            </ul>
          </div>

          <div className="list-container">
            <h2>IPs Suspeitos:</h2>
            <ul>
              {suspectsIps.length > 0 ? (
                suspectsIps.map((ip, index) => (
                  <li key={index}>{ip}</li>
                ))
              ) : (
                <li className="placeholder-text">Nenhum IP suspeito.</li>
              )}
            </ul>
          </div>
        </aside>

        <section className="flex-1">

          {/* <div className="card"> */}
            <h2>Posições geográficas</h2>
            <div className="icon-center">
              <WorldMap 
                markerPosition={markerPosition}
                monitoredIps={monitoredIps}
              />
            </div>
          {/* </div> */}

          <Chart />
        </section>
      </main>
    </div>
  );
}
