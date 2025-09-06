import requests

# 🔹 Configurações
API_KEY = "d5e24f0f76891605e1013f70a37105d7bdd6710e51150db182f6a90ec800bac437327f92d3145434"  # substitua pela sua chave
IP_TO_CHECK = "43.134.228.122"       # substitua pelo IP que deseja verificar

# 🔹 Função para checar IP
def check_ip(ip):
    url = "https://api.abuseipdb.com/api/v2/check"
    headers = {
        "Key": API_KEY,
        "Accept": "application/json"
    }
    params = {
        "ipAddress": ip,
        "maxAgeInDays": 90  # considera denúncias nos últimos 90 dias
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()["data"]
        print(f"IP: {data['ipAddress']}")
        print(f"País: {data.get('countryCode', 'N/A')}")
        print(f"Uso: {data.get('usageType', 'N/A')}")
        print(f"Domínio: {data.get('domain', 'N/A')}")
        print(f"Abuse Confidence Score: {data['abuseConfidenceScore']}")
        print(f"Total de Reports: {data['totalReports']}")
    else:
        print(f"Erro {response.status_code}: {response.text}")

# 🔹 Executa
check_ip(IP_TO_CHECK)
