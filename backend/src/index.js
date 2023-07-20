require('dotenv').config({ path: `${process.env.ENVIRONMENT}.env` });
const webServer = require('./services/web-server.js');
const database = require('./services/database.js');
const dbConfig = require('./config/database.js');

const defaultThreadPoolSize = 4;

process.env.UV_THREADPOOL_SIZE =
  dbConfig.feedbackPool.max + defaultThreadPoolSize;

process.once('SIGTERM', database.close).once('SIGINT', database.close);

async function startup() {
  console.log(`Starting application in ${process.env.ENVIRONMENT} environment`);

  try {
    console.log('Initializing database module');
    await database.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log('Initializing web server module');
    await webServer.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
}

startup();
