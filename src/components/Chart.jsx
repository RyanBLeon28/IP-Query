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
import "./chart.css"

const SORT_TYPES = {
  NONE: 'none',
  DESC: 'desc',
  ASC: 'asc',   
};

const MIN_PERCENT = 10;
const MAX_PERCENT = 100;
const STEP_PERCENT = 10;

const Chart = ({ data }) => {
  const [sortOrder, setSortOrder] = useState(SORT_TYPES.NONE);
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
    
    return sortedData.slice(0, itemsToShow);

  }, [sortedData, porcentView]); // Re-calcula quando a ordem ou a porcentagem mudam

  const handleIncreaseView = () => {
    // Math.min garante que não passe de MAX_PERCENT
    setPorcentView(currentPercent => Math.min(currentPercent + STEP_PERCENT, MAX_PERCENT));
  };
  
  const handleDecreaseView = () => {
    // Math.max garante que não seja menor que MIN_PERCENT
    setPorcentView(currentPercent => Math.max(currentPercent - STEP_PERCENT, MIN_PERCENT));
  };

  return (
    <div className="chart-container">
    <div className="chart-header">
      <h2>Acessos de IPs Suspeitos</h2>
      
      <div className="chart-controls">
        
        <div className="chart-controls-left">
          <div className="chart-sort-buttons">
            <button 
              onClick={() => setSortOrder(SORT_TYPES.NONE)}
              className={`chart-button ${sortOrder === SORT_TYPES.NONE ? 'active-state' : 'default-state'}`}
            >
              Padrão
            </button>
            <button 
              onClick={() => setSortOrder(SORT_TYPES.DESC)}
              className={`chart-button ${sortOrder === SORT_TYPES.DESC ? 'active-state' : 'default-state'}`}
            >
              Mais Relevantes
            </button>
            <button 
              onClick={() => setSortOrder(SORT_TYPES.ASC)}
              className={`chart-button ${sortOrder === SORT_TYPES.ASC ? 'active-state' : 'default-state'}`}
            >
              Menos Relevantes
            </button>
          </div>  

        </div>

        <div className="chart-controls-right">
          <span className="chart-view-percent">Exibindo: {porcentView}% dos dados</span>
          <div className="chart-zoom-buttons">
            <button 
              onClick={handleDecreaseView}
              disabled={porcentView <= MIN_PERCENT}
              className="chart-zoom-button decrease-button" 
            >
              -
            </button>
            <button 
              onClick={handleIncreaseView}
              disabled={porcentView >= MAX_PERCENT}
              className="chart-zoom-button"
            >
              +
            </button>
          </div>
        </div>

      </div>
    </div>

      <div className="w-full mt-4" style={{ height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={finalData} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}>
            <XAxis dataKey="ip" angle={-45} textAnchor="end" interval={0}>
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