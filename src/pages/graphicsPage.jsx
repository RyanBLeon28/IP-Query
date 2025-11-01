import React from "react";
import "./dashboard.css"; // O CSS já está no layout, mas pode manter por via das dúvidas
import Chart from "../components/Chart";
import StatsCards from "../components/StatsCards";
import SuspectsTable from "../components/SuspectsTable";
import { useIpData } from "../components/DataLayout";

export default function GraphicsPage() {
  // Pegue APENAS os dados que esta página precisa
  const { monitoredIps, suspectsIps, ipInfoMap, loadingSuspects } = useIpData();

  console.log("[GraphicsPage] Renderizado com " + monitoredIps.length + " IPs monitorados.");
  
  // Transforma os dados para o gráfico (como antes)
  const chartData = Object.entries(ipInfoMap).map(([ip, info]) => ({
    ip: ip,
    acessos: info.accessCount,
  }));

  // O return agora é SÓ o <main>.
  return (
    <main className="graphics-main">
      <StatsCards
        total={monitoredIps.length}
        suspicious={suspectsIps.length}
      />

      <Chart data={chartData} />
    </main>
  );
}