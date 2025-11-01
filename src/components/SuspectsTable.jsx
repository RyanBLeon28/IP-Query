import React from "react";

const SuspectsTable = ({ suspects, loading }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>IPs Suspeitos Identificados</h2>
      </div>
      <div className="suspect-list-container">
        {loading && <p>Verificando IPs...</p>}
        {!loading && suspects.length === 0 && (
          <p>Nenhum IP suspeito encontrado na lista.</p>
        )}
        {!loading && suspects.length > 0 && (
          <ul className="suspect-list">
            {suspects.map((ip) => (
              <li key={ip}>{ip}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SuspectsTable;