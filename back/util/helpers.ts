import bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hashed = bcrypt.hash(password, salt);
  return hashed;
};

const isString = (x: unknown) => typeof x === 'string' || x instanceof String;

export { hashPassword, isString };
