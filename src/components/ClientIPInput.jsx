import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { IPInfo } from "../requests/IPInfos";

export default function ClientIPInput() {

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
    if (submitted) {
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
      console.log("DOMINIO:", value, isIP ? "(IP)" : "(DNS)");

      IPInfo(value)
        .then(infos => {
          if (infos) {
            console.log('Informações do IP:', infos);
            console.log(`País: ${infos.country}`);
            console.log(`Cidade: ${infos.city}`);
            console.log(`Organização (ISP): ${infos.org}`);
          } else {
            console.log('error in request.');
          }
        });


      setSubmitted(false);
    }
  }, [submitted, value]);

  return (
    <div className="flex items-center gap-1 bg-orange-600 px-2 py-2 rounded-4xl shadow w-full max-w-sm">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Digite seu IP ou DNS"
        className="flex-1 bg-transparent outline-none text-white placeholder-white"
      />
      <button onClick={handleSubmit} className="text-white hover:text-black">
        <Check size={24} />
      </button>
    </div>
  );
};