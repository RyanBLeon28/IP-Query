export async function checkDomainStatus(domain) {
  const dnsUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`;

  try {
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

    const webResponse = await fetch(`https://${domain}`, {
        method: 'HEAD'
    });

    const isOnline = webResponse.ok;
    const statusCode = webResponse.status;

    return {
      is_active: isOnline,
      dns_resolved: true,
      status_code: statusCode
    };

  } catch (error) {
    console.error('Ocorreu um erro ao verificar o domínio:', error.message);
    return {
      is_active: false,
      dns_resolved: false,
      status_code: null
    };
  }
}
