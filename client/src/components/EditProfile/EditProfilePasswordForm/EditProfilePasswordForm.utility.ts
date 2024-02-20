const isPasswordValid = (password: string): boolean => {
  const lengthRegex = /^.{8,20}$/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;

  const isValidLength = lengthRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasLowercase = lowercaseRegex.test(password);
  const hasSymbol = symbolRegex.test(password);

  return isValidLength && hasUppercase && hasLowercase && hasSymbol;
};

export { isPasswordValid };
