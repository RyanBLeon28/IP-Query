/**
 * Utiliza a ip-api para buscar a localizacao dos IPs
 * Busca informações de um IP ou domínio usando a API gratuita ip-api.com.
 * @param {string} query - O endereço de IP ou o nome de domínio a ser consultado.
 * @returns {Promise<object|null>} Um objeto com as informações ou null em caso de erro.
 */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getIpInfo(ipArray) {
  try {
    const response = await axios.post(`${API_URL}/get-ip-info-list`, {
      ips: ipArray
    });
    
  // console.log("RESULTADO no frontend IPinfo: ",response.data)
    return response.data;

  } catch (error) {
    console.error('Ocorreu um erro ao buscar lista de IPInfo:', error);
    return []; 
  }
}