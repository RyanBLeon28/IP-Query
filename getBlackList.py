import requests
import json
import csv

# Substitua pela sua chave de API
API_KEY = 'd5e24f0f76891605e1013f70a37105d7bdd6710e51150db182f6a90ec800bac437327f92d3145434'

# URL da API para obter os 10.000 IPs mais abusivos
url = 'https://api.abuseipdb.com/api/v2/blacklist'

# Cabeçalhos da requisição
headers = {
    'Key': API_KEY,
    'Accept': 'application/json'
}

# Parâmetros da requisição
params = {
    'limit': 10000,
    'confidenceMinimum': 100  # Apenas IPs com 100% de confiança
}

# Realiza a requisição GET
response = requests.get(url, headers=headers, params=params)

# Verifica o status da resposta
if response.status_code == 200:
    data = response.json()
    ips = data['data']
    print(f"Total de IPs recebidos: {len(ips)}")

    # Salva os IPs em um arquivo CSV
    with open('blacklist_ips.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['IP Address', 'Abuse Confidence Score', 'Last Reported At'])
        for ip in ips:
            writer.writerow([ip['ipAddress'], ip['abuseConfidenceScore'], ip['lastReportedAt']])
    print("Arquivo 'blacklist_ips.csv' salvo com sucesso.")
else:
    print(f"Erro ao obter dados: {response.status_code} - {response.text}")
