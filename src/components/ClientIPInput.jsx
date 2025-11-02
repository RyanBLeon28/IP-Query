import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import "./clientIPInput.css";
import { getSingleQueryGeo, getIpInfo } from "../requests/GetIPInfo";

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
    const fetchData = async (query) => {
      const infoList = await getIpInfo([query]);
      const domainInfo = infoList[0];

      if (domainInfo && domainInfo.country) {
        console.log("\n--- Informações para o domínio ---");
        console.log(`País: ${domainInfo.country}`);
        console.log(`Cidade: ${domainInfo.city}`);
        console.log(`Organização (ISP): ${domainInfo.org}`); 
        console.log(`Endereço de IP resolvido: ${domainInfo.ip}`); 
        
        if (domainInfo.loc) {
          const [lat, lon] = domainInfo.loc.split(',').map(Number);
          onLocationFound([lat, lon]);
        }
      } else {
        console.error("Falha ao buscar geolocalização:", domainInfo?.message || "Resposta inválida");
      }
      
      setSubmitted(false);
    }

    if (submitted && value) {
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
      console.log("Consultando:", value, isIP ? "(IP)" : "(DNS)");
      
      if (isIP) {
        fetchData(value); 
      } else {
        console.log("Busca por DNS não implementada.");
        fetchData(value);
        setSubmitted(false);
      }
    }

  }, [submitted, value, onLocationFound]);

  return (
    <div className="clientDiv">
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="clientForm"
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