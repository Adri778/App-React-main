const path = require('path');
const mysql = require('mysql2');

// Node 20.6+ lê o .env nativamente, sem precisar do pacote dotenv.
process.loadEnvFile(path.join(__dirname, '..', '.env'));

// createPool e não createConnection: com uma conexão única, se o MySQL recusa
// a conexão no boot, o callback das queries seguintes nunca é chamado e a
// requisição HTTP fica pendurada. Com pool, o erro chega no callback.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
});

module.exports = pool;
