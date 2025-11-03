
const API_KEY = import.meta.env.VITE_IPINFO_API_KEY;

// Função assíncrona para consultar informações do IP
export async function IPInfo(ip) {
  const apiKey = API_KEY; 
  const url = `https://ipinfo.io/${ip}/json?token=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Ocorreu um erro:', error);
    return null;
  }
}