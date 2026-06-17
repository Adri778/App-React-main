// Endereço do servidor na rede local.
// Emulador Android: 10.0.2.2 | Dispositivo físico / navegador: IP da máquina na rede
// Altere apenas o HOST aqui — BASE_URL e a tela de cadastro derivam dele.
export const HOST = '192.168.1.6';

// API REST do backend — porta 3000, sob o prefixo /api (ex.: /api/produtos).
const BASE_URL = `http://${HOST}:3000/api`;

// Site/admin onde fica a TELA DE CADASTRO de produtos, carregada na WebView do app — porta 5173.
export const URL_CADASTRO = `http://${HOST}:5173/admin/produtos/novo`;

export default BASE_URL;
