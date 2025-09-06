import React, { useEffect, useState } from "react";
import "./SuspectList.css"
import { checkIp } from "../requests/AbuseIPsCheck";

export default function SuspectsList({ monitoredIps }) {
  const [suspectsIps, setSuspectsIps] = useState([]);

  useEffect(() => {
    const fetchSuspects = async () => {
      if (monitoredIps.length === 0) return;

      const results = [];
      for (const ip of monitoredIps) {
        const result = await checkIp(ip);
        results.push(result);
      }

      // Filtra apenas IPs com score alto
      const suspects = results
        .filter(r => r.score >= 80)
        .map(r => r.ip);

      setSuspectsIps(suspects);
    };

    fetchSuspects();
  }, [monitoredIps]);

  return (
    <div className="list-container">
      <div className="header-suspects">
        <h2>IPs Abusivos:</h2>
        <p>{suspectsIps.length}</p>
      </div>
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
  );
}
