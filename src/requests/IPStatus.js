export async function checkDomainStatus(domain) {
  const dnsUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`;

  try {
    // Passo 1: Verificar a resolução de DNS
    const dnsResponse = await fetch(dnsUrl, {
      headers: { 'accept': 'application/dns-json' }
    });

    const dnsData = await dnsResponse.json();
    const hasDnsRecords = dnsData.Answer && dnsData.Answer.length > 0;
    
    if (!hasDnsRecords) {
      return {
        is_active: false,
        dns_resolved: false,
        status_code: null
      };
    }

    // Passo 2: Tentar acessar o domínio via HTTPS
    // Usamos 'https://' para garantir que a requisição seja segura
    const webResponse = await fetch(`https://${domain}`, {
        method: 'HEAD' // Usamos HEAD para obter apenas o cabeçalho, mais rápido
    });

    const isOnline = webResponse.ok;
    const statusCode = webResponse.status;

    return {
      is_active: isOnline,
      dns_resolved: true,
      status_code: statusCode
    };

  } catch (error) {
    // Se a requisição falhar (domínio não existe, erro de CORS, etc.)
    console.error('Ocorreu um erro ao verificar o domínio:', error.message);
    return {
      is_active: false,
      dns_resolved: false,
      status_code: null
    };
  }
}
