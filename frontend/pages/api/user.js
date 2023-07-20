import { withIronSessionApiRoute } from 'iron-session/next';
import { fetchSession } from '../../lib/session';
import jwt from 'jsonwebtoken';

async function userRoute(req, res) {
  const sessionResponse = await fetchSession();
  if (req.session.user) {
    const backendToken = jwt.sign(
      { ...req.session.user },
      sessionResponse.backendConfig.jwtSecret,
      { expiresIn: '1h' },
    );
    res.json({
      ...req.session.user,
      backendToken,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}

export default withIronSessionApiRoute(userRoute, async () => {
  const sessionResponse = await fetchSession();
  return sessionResponse.sessionOptions;
});
