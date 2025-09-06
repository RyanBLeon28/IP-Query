import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import "./clientIPInput.css";
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
    <div className="clientDiv">
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="flex items-center justify-end gap-1 bg-orange-600 px-2 py-2 rounded-full shadow w-full max-w-sm"
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Digite seu IP ou DNS"
          className="clientInput"
        />
        <button 
          onClick={handleSubmit} 
          className="clientButton"
        >
          <Search size={28} color='#fff'/>
        </button>
      </form>
    </div>
  );
};