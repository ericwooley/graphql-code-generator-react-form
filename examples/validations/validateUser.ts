import { UserInputValidation, UserInput } from '../generated/forms';
import { validateEmail } from './validateEmail';
export const validateUser = (user: UserInput): UserInputValidation => {
  const result: UserInputValidation = {
    email: validateEmail(user.email),
    father: user.father ? validateUser(user.father) : '',
    mother: user.mother ? validateUser(user.mother) : '',
    name: user.name.length > 2 ? '' : 'Name  must be at least 2 characters.',
    friends: {
      list: user.friends.map((user) =>
        user ? validateUser(user) : 'friend is required'
      ),
    },
  };
  return result;
};
