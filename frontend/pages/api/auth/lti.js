import { Issuer } from 'openid-client';
import { withIronSessionApiRoute } from 'iron-session/next';
import { createRemoteJWKSet } from 'jose';
import { fetchSession } from '../../../lib/session';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// OpenID Connect Launch Flow: http://www.imsglobal.org/spec/security/v1p0/#platform-originating-messages

const LTI_CLAIMS = {
  messageType: 'https://purl.imsglobal.org/spec/lti/claim/message_type',
  targetLinkUri: 'https://purl.imsglobal.org/spec/lti/claim/target_link_uri',
  custom: 'https://purl.imsglobal.org/spec/lti/claim/custom',
  context: 'https://purl.imsglobal.org/spec/lti/claim/context',
};

const createCanvasClient = async (ltiConfig) => {
  const Canvas = new Issuer({
    issuer: ltiConfig.issuerID,
    authorization_endpoint: ltiConfig.authURI,
    jwks_uri: ltiConfig.jwksURI,
  });

  return new Canvas.Client({
    client_id: ltiConfig.clientId,
    client_secret: ltiConfig.clientSecret,
    redirect_uris: [ltiConfig.redirectURI],
    response_types: ['code'],
  });
};

/* Step 2:
    a) Create authentication request with LTI 1.3 specificed parameters
    b) Save session parameters to be used in in Step 4
    c) Redirect to Canvas Authorization Endpoint
*/

async function handleInitiateLogin(req, res, canvasClient, ltiConfig) {
  try {
    const { nonce, state } = ltiConfig;
    const redirect = canvasClient.authorizationUrl({
      scope: 'openid',
      response_type: 'id_token',
      response_mode: 'form_post',
      prompt: 'none',
      client_id: req.body.client_id,
      login_hint: req.body.login_hint,
      lti_message_hint: req.body.lti_message_hint,
      nonce,
      state,
    });
    req.session.nonce = nonce;
    req.session.state = state;
    await req.session.save();

    res.redirect(303, redirect);
  } catch (error) {
    console.log('Error encountered while initiating login', error);
    res.json({ error: error.message, stack: error.stack });
  }
}

/* Step 4:
    a) Decode and validate the id_token / state using the Canvas Public JWKS.
    b) Redirect to the targetLinkURI
 */
async function handleAuthenticationResponse(req, res, canvasClient, ltiConfig) {
  try {
    const { nonce, state } = req.session;
    const keys = createRemoteJWKSet(new URL(ltiConfig.jwksURI));

    canvasClient.metadata.jwks = keys;

    if (!req.cookies?.feedback_session) {
      res.redirect(303, `${publicRuntimeConfig.basePath}/cookie-error`);
      return;
    }

    const tokenSet = await canvasClient.callback(
      ltiConfig.redirectURI,
      req.body,
      {
        response_type: 'id_token',
        nonce,
        state,
      },
    );
    const claims = tokenSet.claims();
    const customClaim = claims[LTI_CLAIMS.custom];
    const contextClaim = claims[LTI_CLAIMS.context];

    // user session data
    const user = {
      id: customClaim.canvas_user_id,
      name: claims.name,
      courseId: customClaim.canvas_course_id.toString(),
      courseName: contextClaim.title,
      subaccountName: customClaim.canvas_account_name,
      isAdmin: customClaim.canvas_isrootaccountadmin === 'true',
      roles: customClaim.canvas_membership_roles.split(','),
      termCode: customClaim.canvas_term_name,
    };

    req.session.user = user;

    await req.session.save();

    // Step 4: Resource is displayed (Canvas <- Tool)
    if (claims[LTI_CLAIMS.messageType] === 'LtiResourceLinkRequest') {
      res.redirect(303, claims[LTI_CLAIMS.targetLinkUri]);
    } else {
      res.json({ claims });
    }
  } catch (error) {
    console.log('Error encountered while redirecting to content:', error);
    res.json({ error: error.message, stack: error.stack });
  }
}

async function handler(req, res) {
  const session = await fetchSession();
  const canvasClient = await createCanvasClient(session.ltiConfig);
  if (req.body.login_hint) {
    // Step 1: Third-party Initiated Login (Canvas -> Tool)
    // Step 2: Authentication Request (Canvas <- Tool)
    await handleInitiateLogin(req, res, canvasClient, session.ltiConfig);
  } else if (req.body.id_token) {
    // Step 3: Authentication Response (Canvas -> Tool)
    // Step 4: Resource is displayed (Canvas <- Tool)
    await handleAuthenticationResponse(
      req,
      res,
      canvasClient,
      session.ltiConfig,
    );
  } else {
    res.json({ error: 'unrecognized message' });
  }
}

export default withIronSessionApiRoute(handler, async () => {
  const sessionResponse = await fetchSession();
  return sessionResponse.sessionOptions;
});
