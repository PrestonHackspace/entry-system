import { deepFreeze, Validator, RegEx } from "../lib";

export interface Registration {
  email: string;
  name: string;
}

export type PartialRegistration = Partial<Registration>;

export const RegistrationDummy: Registration = deepFreeze({
  email: '',
  name: '',
});

export const RegistrationSample: Registration = deepFreeze({
  email: 'dummy@example.com',
  name: 'Joe Bloggs',
});

export const UserValidator: Validator<PartialRegistration> = {
  email: [(val?: string) => val && !RegEx.Email.test(val) ? 'Please enter a valid email address.' : undefined],
  name: [(val?: string) => !val ? 'Please enter a name.' : undefined],
};
