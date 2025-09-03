import React, { useState } from "react";
import {
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const Chart = () => {
  const [granularity, setGranularity] = useState("diario");

  // Dados falsos por granularidade
  const dataSets = {
    diario: [
      { ip: "192.168.0.1", acessos: 120 },
      { ip: "192.168.0.2", acessos: 80 },
      { ip: "192.168.0.3", acessos: 200 },
      { ip: "192.168.0.4", acessos: 150 },
      { ip: "192.168.0.5", acessos: 60 },
      { ip: "192.168.0.6", acessos: 90 },
      { ip: "192.168.0.7", acessos: 110 },
      { ip: "192.168.0.8", acessos: 50 },
    ],
    semanal: [
      { ip: "192.168.0.1", acessos: 820 },
      { ip: "192.168.0.2", acessos: 600 },
      { ip: "192.168.0.3", acessos: 1500 },
      { ip: "192.168.0.4", acessos: 1200 },
      { ip: "192.168.0.5", acessos: 450 },
      { ip: "192.168.0.6", acessos: 700 },
      { ip: "192.168.0.7", acessos: 930 },
      { ip: "192.168.0.8", acessos: 390 },
    ],
    mensal: [
      { ip: "192.168.0.1", acessos: 3200 },
      { ip: "192.168.0.2", acessos: 2800 },
      { ip: "192.168.0.3", acessos: 5000 },
      { ip: "192.168.0.4", acessos: 4200 },
      { ip: "192.168.0.5", acessos: 1700 },
      { ip: "192.168.0.6", acessos: 2500 },
      { ip: "192.168.0.7", acessos: 3100 },
      { ip: "192.168.0.8", acessos: 1400 },
    ],
  };

  const data = dataSets[granularity];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Gráficos</h2>
        <span className="badge">Acessos ⬇</span>
      </div>

      <div className="granularity-select">
        <label>Visualizar por: </label>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
        >
          <option value="diario">Diário</option>
          <option value="semanal">Semanal</option>
          <option value="mensal">Mensal</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ip" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="acessos" fill="#ff6600" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
