# IP Query

---

Este é o frontend (dashboard) do IP Query, uma Single Page Application (SPA) construída em React com Vite. Esta interface permite ao usuário visualizar a origem e a reputação de endereços IP que acessaram um serviço.

O sistema consome uma API de backend própria (hospedada no Render), que por sua vez agrega dados de múltiplas fontes de inteligência de ameaças (Threat Intelligence), incluindo AbuseIPDB, VirusTotal e ipinfo.io.

Importância do Trabalho: Em um cenário de cibersegurança com ameaças crescentes, este painel fornece uma visão clara e imediata sobre potenciais riscos. Ele traduz dados de segurança brutos em visualizações intuitivas, permitindo que um analista ou administrador de sistema identifique rapidamente padrões de ataque, como países de origem frequentes (através do mapa de calor) ou IPs específicos com má reputação (através da lista de IPs abusivos).

Funcionalidades:

- Upload de arquivos .txt contendo listas de IPs/domínios.

- Barra de pesquisa para consulta individual de IPs ou domínios.

- Mapa de Calor: Um mapa interativo que colore os países com base na densidade de acessos.

- Lista de Ameaças: Tabelas filtráveis que mostram quais IPs são considerados suspeitos com base no score agregado do backend.

- Visualização Gráfica: Gráficos que mostram a distribuição de acessos.

---

## Acesse a aplicação em:
https://ip-query-taupe.vercel.app/


---

## Instalar dependências
npm install

## Rodar a aplicação
npm start