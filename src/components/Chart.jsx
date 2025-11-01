import React, {useState, useMemo} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label
} from "recharts";

const SORT_TYPES = {
  NONE: 'none',
  DESC: 'desc',
  ASC: 'asc',   
};

const MIN_PERCENT = 10;
const MAX_PERCENT = 100;
const STEP_PERCENT = 10;

const Chart = ({ data }) => {
  const [sortOrder, setSortOrder] = useState(SORT_TYPES.DESC);
  const [porcentView, setPorcentView] = useState(MAX_PERCENT);

  const sortedData = useMemo(() => {
    if (sortOrder === SORT_TYPES.NONE) {
      return data;
    }
    const sortFn = (a, b) => {
      return sortOrder === SORT_TYPES.DESC 
        ? b.acessos - a.acessos
        : a.acessos - b.acessos;
    };
    return [...data].sort(sortFn);
    
  }, [data, sortOrder]);

  const finalData = useMemo(() => {
    // Calcula quantos itens devem ser mostrados
    const itemsToShow = Math.ceil(sortedData.length * (porcentView / 100));
    
    // Retorna a fatia (slice) do array.
    // Como os dados JÁ ESTÃO ORDENADOS, isso pega o "Top N%"
    return sortedData.slice(0, itemsToShow);

  }, [sortedData, porcentView]); // Re-calcula quando a ordem ou a porcentagem mudam

  // 4. Funções para os botões de porcentagem
  const handleIncreaseView = () => {
    // Math.min garante que não passe de MAX_PERCENT
    setPorcentView(currentPercent => Math.min(currentPercent + STEP_PERCENT, MAX_PERCENT));
  };
  
  const handleDecreaseView = () => {
    // Math.max garante que não seja menor que MIN_PERCENT
    setPorcentView(currentPercent => Math.max(currentPercent - STEP_PERCENT, MIN_PERCENT));
  };
return (
    <div className="card w-full bg-white shadow-md rounded-lg p-4">
      <div className="card-header border-b border-gray-200 pb-2 mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Acessos de IPs Suspeitos</h2>
        
        <div className="flex justify-between items-center mt-2">
          {/* Grupo da Esquerda (Ordenação) */}
          <div className="flex gap-2">
            <button 
              onClick={() => setSortOrder(SORT_TYPES.DESC)}
              className={`px-3 py-1 rounded text-sm ${sortOrder === SORT_TYPES.DESC ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
            >
              Mais Relevantes
            </button>
            <button 
              onClick={() => setSortOrder(SORT_TYPES.ASC)}
              className={`px-3 py-1 rounded text-sm ${sortOrder === SORT_TYPES.ASC ? 'bg-blue-600 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}
            >
              Menos Relevantes
            </button>
          </div>

          {/* Grupo da Direita (Porcentagem) */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDecreaseView}
              disabled={porcentView <= MIN_PERCENT}
              className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Menos
            </button>
            <button 
              onClick={handleIncreaseView}
              disabled={porcentView >= MAX_PERCENT}
              className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Mais
            </button>
            <span className="text-sm text-gray-600">Exibindo: {porcentView}%</span>
          </div>
        </div>
      </div>

      {/* CORREÇÃO: 
        Voltamos a usar o 'style' inline para definir a altura.
        A classe 'h-[340px]' do Tailwind foi removida.
        Isso garante que o ResponsiveContainer tenha uma altura para usar.
      */}
      <div className="w-full mt-4" style={{ height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={finalData} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}>
            <XAxis dataKey="ip" angle={-45} textAnchor="end" interval={0}>
              {/* CORREÇÃO DO LABEL:
                offset={60} (positivo) move "IPs" para BAIXO.
                offset={-80} (negativo) move para CIMA.
              */}
              <Label value="IPs" offset={-80} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label 
                value="Acessos" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle' }} 
              />
            </YAxis>
            <Tooltip />
            <Bar dataKey="acessos" fill="#ff6600" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;