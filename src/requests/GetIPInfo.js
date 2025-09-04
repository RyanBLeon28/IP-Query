/**
 * Busca informações de um IP ou domínio usando a API gratuita ip-api.com.
 * @param {string} query - O endereço de IP ou o nome de domínio a ser consultado.
 * @returns {Promise<object|null>} Um objeto com as informações ou null em caso de erro.
 */
export async function getIpInfo(query) {
  // A URL da API. O campo 'fields' é opcional, mas ajuda a pedir só os dados que você precisa.
  // Removi 'fields' para este exemplo para obter todos os dados disponíveis.
  const url = `http://ip-api.com/json/${query}`;

  // console.log(`Consultando a API para: ${query}...`);

  try {
    const response = await fetch(url);

    // Verifica se a requisição de rede foi bem-sucedida (ex: status 200)
    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // A API ip-api.com retorna um campo 'status'. Se for 'fail', a consulta não teve sucesso.
    if (data.status === 'fail') {
      throw new Error(`Erro da API: ${data.message}`);
    }

    // Se tudo deu certo, retorna os dados
    return data;

  } catch (error) {
    console.error(`Ocorreu um erro ao buscar informações para "${query}":`, error.message);
    return null; // Retorna nulo para indicar que houve uma falha
  }
}