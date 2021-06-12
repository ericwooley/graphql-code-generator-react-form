import { UserInputValidation, UserInput } from '../generated/forms';
import { validateEmail } from './validateEmail';
export const validateUser = (user: UserInput): UserInputValidation => {
  return {
    email: validateEmail(user.email),
    father: user.father ? validateUser(user.father) : '',
    mother: user.mother ? validateUser(user.mother) : 'Mother is required.',
    name: user.name.length > 2 ? '' : 'Name  must be at least 2 characters.',
    friends: {
      __meta: user.friends.length ? '' : 'You must have friends',
      list: user.friends.map((user) =>
        user ? validateUser(user) : 'friend is required'
      ),
    },
  };
};
