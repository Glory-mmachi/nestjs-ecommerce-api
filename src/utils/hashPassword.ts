import * as bcrypt from 'bcrypt';

export function getPasswordHash(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const rounds = isNaN(saltRounds) ? 10 : saltRounds;
  return bcrypt.hash(password, rounds);
}
