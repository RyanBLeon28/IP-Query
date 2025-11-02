import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkIpList(ipArray) {
  try {
    const res = await axios.post(`${API_URL}/check-ip-list`, {
      ips: ipArray 
    });
    // console.log("Resultado da lista:",res.data)
    return res.data.map(result => ({
      ip: result.ip,
      score: result.finalScore
    }));

  } catch (err) {
    console.error("Erro ao consultar lista de IPs:", err.message);
    return []; 
  }
}