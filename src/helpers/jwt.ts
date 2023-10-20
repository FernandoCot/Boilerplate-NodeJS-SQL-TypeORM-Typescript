// Other
import { verify, sign } from 'jsonwebtoken';

const SECRET = 'AH9SHASHUAUHDUHSUHSADHAHUSDHU';

const signOptions = {
  expiresIn: '12h',
};

const generateJWT = (user: { id: number; name: string; email: string; }) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return sign(payload, SECRET, signOptions);
};

// The func below verifies if the token exists and if it's still valid
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json('Token não pode ser nulo!');
  } else {
    return verify(token, SECRET, (err) => {
      if (err) return res.status(401).json('Token expirado ou inválido!');
      return next();
    });
  }
};

const decodeJWT = (token: string) => {
  const decoded = verify(token, SECRET);
  // console.log(decoded)
  return decoded;
};

export { generateJWT, verifyToken, decodeJWT };