import RegexSchema from '../constants/regex';

export const nameValidator = { required: 'Name must be required' };
export const bioValidator = { required: 'Bio must be required' };
export const usernameValidator = {
  required: 'Username must be required',
  pattern: {
    value: RegexSchema.Username,
    message: 'Username must be a minimum of 3 characters'
  }
};
export const passwordValidator = {
  required: 'Password must be required',
  pattern: {
    value: RegexSchema.Password,
    message:
      'Password must be at least 8 characters, at least one special character, uppercase, lowercase and one number'
  }
};
export const usernameLoginValidator = {
  required: 'Username must be required'
};
export const passwordLoginValidator = {
  required: 'Password must be required'
};
