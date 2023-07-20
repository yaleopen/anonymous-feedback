const { Pool } = require('pg');
const dbConfig = require('../config/database.js');

// create pool
let pool;
async function initialize() {
  pool = new Pool(dbConfig.feedbackPool);
  pool.on('error', (err) => {
    console.error('Postgres Error:', err);
  });
  pool.on('connect', (client) => {
    client.query(`SET search_path TO "${process.env.DB_FEEDBACK_SCHEMA}"`);
  });
}

// close connections
async function close() {
  console.log('\nTerminating');
  try {
    pool.end(() => {
      console.log('Closed connection pool');
      process.exit(0);
    });
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

// do an execution
async function simpleExecute(text, params) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(text, params);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  } finally {
    if (client) {
      // client assignment worked, need to close the connection
      try {
        client.release();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports.initialize = initialize;
module.exports.close = close;
module.exports.simpleExecute = simpleExecute;
