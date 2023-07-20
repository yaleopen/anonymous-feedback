const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  assetPrefix: isProd ? '/anon-feedback' : '',
  publicRuntimeConfig: {
    backendURL: process.env.BACKEND_URL || 'http://localhost:4000',
    basePath: isProd ? '/anon-feedback' : '',
  },
  serverRuntimeConfig: {
    canvasClientId: process.env.CANVAS_CLIENT_ID,
    canvasClientSecret: process.env.CANVAS_CLIENT_SECRET,
    canvasJwksUri: process.env.CANVAS_JWKS_URI,
    canvasIssuerId: process.env.CANVAS_ISSUER_ID,
    canvasAuthUri: process.env.CANVAS_AUTH_URI,
    appRedirectUri: process.env.APP_REDIRECT_URI,
    appSessionKey: process.env.APP_SESSION_KEY,
    appJwtSecret: process.env.APP_JWT_SECRET,
  },
  webpack5: false,
};
