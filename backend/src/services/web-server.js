const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const debug = require('debug')('app:web-server');
const expressJwt = require('express-jwt');
const createServer = require('./createServer');
const emailAPI = require('./emailRemider/emailReminderAPI');

// configure express middleware
const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};

async function initialize() {
  debug('Initilazing Web Server');
  app.enable('trust proxy');
  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(passport.initialize());
  emailAPI(app);

  // decodes token and puts payload on req.user
  app.use(
    expressJwt({
      secret: process.env.APP_SECRET,
      algorithms: ['HS256'],
      credentialsRequired: false,
    })
  );

  // create apollo server
  const server = await createServer();
  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  // The `listen` method launches a web server.
  app.listen({ port: process.env.APP_PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.APP_PORT}${server.graphqlPath}`
    )
  );
}

module.exports.initialize = initialize;
