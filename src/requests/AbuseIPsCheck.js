import axios from "axios";

export async function checkIp(ip) {
  try {
    const res = await axios.get(`http://localhost:5000/check-ip/${ip}`);
    return { ip, score: res.data.abuseConfidenceScore };
  } catch (err) {
    console.error("Erro consultando IP:", ip, err.message);
    return { ip, score: 0, error: true };
  }
}