// Other
import { hash, compare } from 'bcryptjs';

const saltRounds = 10;

const encrypt = async (password: string) => {
  const hashedPass = await hash(password, saltRounds);
  return hashedPass;
};

const decrypt = async (password: string, hash: string) => {
  const unhashedPassword = await compare(password, hash);
  return unhashedPassword;
};

export { encrypt, decrypt };