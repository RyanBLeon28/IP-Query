import csv

# Caminho do arquivo CSV da blacklist
input_file = "blacklist_ips_05_09_2025.csv"
# Caminho do arquivo TXT de saída
output_file = "ips_selecionados.txt"

# Escolha da linha inicial e final (0 = primeira linha de dados após o cabeçalho)
start_line = int(input("Digite a linha inicial: "))
end_line = int(input("Digite a linha final: "))

ips = []

with open(input_file, newline="") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)  # pula o cabeçalho
    all_rows = list(reader)
    # seleciona o intervalo de linhas
    selected_rows = all_rows[start_line:end_line]
    # extrai apenas o IP
    ips = [row[0] for row in selected_rows]

# grava no TXT
with open(output_file, "w") as f:
    for ip in ips:
        f.write(ip + "\n")

print(f"{len(ips)} IPs foram salvos em '{output_file}'")
