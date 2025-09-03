
// Função assíncrona para consultar informações do IP
export async function IPInfo(ip) {
  const apiKey = 'fa198529ce9c6a'; 
  const url = `https://ipinfo.io/${ip}/json?token=${apiKey}`;

  try {
    // Faz a requisição à API
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