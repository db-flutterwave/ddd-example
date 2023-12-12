import {isValidNumber} from 'libphonenumber-js';

export const IsHumanName = (input: string): boolean => {
  return /^([\p{L}\p{N}]+(-[\p{L}\p{N}]+)?){2,}((\s([\p{L}\p{N}]+(-[\p{L}\p{N}]+)?){2,})+?(\s+)?)?$/u.test(
    input,
  );
};

export const IsEmailAddress = (input: string): boolean => {
  const rx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return rx.test(input);
};

export const IsPhoneNumber = (input: string): boolean => {
  if (isValidNumber(input)) {
    return true;
  }
  return /^(0|234)([789][01][0-9][\d]{7})$/.test(input);
};
