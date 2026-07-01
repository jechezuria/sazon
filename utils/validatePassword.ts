export type PasswordRules = {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  alphanumeric: boolean;
};

export function validatePassword(pwd: string): PasswordRules {
  return {
    minLength:    pwd.length >= 8,
    hasLetter:    /[a-zA-Z]/.test(pwd),
    hasNumber:    /[0-9]/.test(pwd),
    alphanumeric: /^[a-zA-Z0-9]*$/.test(pwd) && pwd.length > 0,
  };
}

export function isPasswordValid(pwd: string): boolean {
  return Object.values(validatePassword(pwd)).every(Boolean);
}
