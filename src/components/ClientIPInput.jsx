import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { IPInfo } from "../requests/IPInfos";
import { checkDomainStatus } from "../requests/IPStatus";
import { getIpInfo } from "../requests/GetIPInfo";

export default function ClientIPInput({onLocationFound}) {

  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const input = e.target.value;
    const validInput = input.replace(/[^0-9a-zA-Z.-]/g, "");
    setValue(validInput);
  };

  const handleSubmit = () => setSubmitted(true);
  const handleKeyDown = (e) => e.key === "Enter" && handleSubmit();
  const handleBlur = () => setSubmitted(true);

  useEffect(() => {
    const fetchData = async (value) => {
      const domainInfo = await getIpInfo(value);

      if (domainInfo) {
        console.log("\n--- Informações para o domínio ---");
        console.log(`País: ${domainInfo.country}`);
        console.log(`Cidade: ${domainInfo.city}`);
        console.log(`Organização (ISP): ${domainInfo.isp}`);
        console.log(`Endereço de IP resolvido: ${domainInfo.query}`); // 'query' retorna o IP que a API encontrou
        // console.log("Dados completos:", domainInfo); // Descomente para ver todos os dados
        
        if (domainInfo.lat && domainInfo.lon) {
          onLocationFound([domainInfo.lat, domainInfo.lon]);
        }
      }
    }

    if (submitted && value) {
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
      console.log("Consultando:", value, isIP ? "(IP)" : "(DNS)");
      
      fetchData(value);
      setSubmitted(false);
    }

  }, [submitted, value]);

  return (
    <div className="flex items-center gap-1 bg-orange-600 px-2 py-2 rounded-full shadow w-full max-w-sm">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Digite seu IP ou DNS"
        className="flex-1 bg-transparent outline-none text-white placeholder-white pl-2"
      />
      <button 
        onClick={handleSubmit} 
        className="
          w-10 h-10                          // Define altura e largura iguais
          flex items-center justify-center   // Centraliza o ícone dentro do botão
          bg-orange-500                      // Cor de fundo inicial do botão
          rounded-full                       // Deixa o botão perfeitamente redondo
          text-white                         // Cor do ícone da lupa
          hover:bg-orange-400                // Efeito ao passar o mouse
          transition-colors                  // Suaviza a mudança de cor
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 // Estilo de foco
          flex-shrink-0                      // Impede que o botão seja espremido
        "
      >
        <Search size={24} /> {/* <-- Ícone de lupa aqui */}
      </button>
    </div>
  );
};