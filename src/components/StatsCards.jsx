import React from "react";
import { Target, ShieldAlert } from "lucide-react";

const StatsCards = ({ total, suspicious }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <Target size={32} />
        <h3>{total}</h3>
        <p>Total de Acessos Monitorados</p>
      </div>
      <div className="stat-card suspicious">
        <ShieldAlert size={32} />
        <h3>{suspicious}</h3>
        <p>IPs Suspeitos (Score {'>'}= 80)</p>
      </div>
    </div>
  );
};

export default StatsCards;