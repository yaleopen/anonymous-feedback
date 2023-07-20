import { generators } from 'openid-client';
import getConfig from 'next/config';
import { readFileSync, existsSync } from 'fs';

const { serverRuntimeConfig } = getConfig();

//https://github.com/vvo/iron-session#ironoptions
const sessionOptions = {
  password: existsSync(serverRuntimeConfig.appSessionKey)
    ? readFileSync(serverRuntimeConfig.appSessionKey, 'utf8')
    : serverRuntimeConfig.appSessionKey,
  cookieName: 'feedback_session',
  cookieOptions: {
    secure: true,
    sameSite: 'none',
    maxAge: undefined,
  },
};

// https://canvas.instructure.com/doc/api/file.lti_dev_key_config.html
const ltiConfig = {
  clientId: serverRuntimeConfig.canvasClientId,
  clientSecret: existsSync(serverRuntimeConfig.canvasClientSecret)
    ? readFileSync(serverRuntimeConfig.canvasClientSecret, 'utf8')
    : serverRuntimeConfig.canvasClientSecret,
  jwksURI: serverRuntimeConfig.canvasJwksUri,
  issuerID: serverRuntimeConfig.canvasIssuerId,
  authURI: serverRuntimeConfig.canvasAuthUri,
  redirectURI: serverRuntimeConfig.appRedirectUri,
  state: generators.random(),
  nonce: generators.random(),
};

const backendConfig = {
  jwtSecret: existsSync(serverRuntimeConfig.appJwtSecret)
    ? readFileSync(serverRuntimeConfig.appJwtSecret, 'utf8')
    : serverRuntimeConfig.appJwtSecret,
};

export default function handler(req, res) {
  const session = {
    sessionOptions,
    ltiConfig,
    backendConfig,
  };
  res.json(session);
}
