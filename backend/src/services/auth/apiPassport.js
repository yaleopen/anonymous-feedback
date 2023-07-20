const { BasicStrategy } = require('passport-http');
const { Passport } = require('passport');

const apiPassport = new Passport();

apiPassport.use(
  'basic',
  new BasicStrategy((username, password, done) => {
    if (
      username !== process.env.API_USER ||
      password !== process.env.API_PASSWORD
    ) {
      return done(null, false);
    }
    return done(null, username);
  })
);

module.exports.apiPassport = apiPassport;
