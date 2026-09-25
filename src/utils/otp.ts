import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashOTP = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, SALT_ROUNDS);
};

export const compareOTP = async (
  otp: string,
  hashedOTP: string,
): Promise<boolean> => {
  return bcrypt.compare(otp, hashedOTP);
};
