export const validateEmail = (email: string = '') =>
  !!email.match(/.+@.+\..+/) ? '' : 'Must be a valid email';
