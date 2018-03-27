export type Envs = 'development' | 'staging' | 'production';

export interface Bootstrap {
  baseUrl: string;
  env: Envs;
  demoMode: boolean;
}

export interface Config {
  systemFromEmail: string | null;
  adminNotificationEmails: string | null;

  confirmEmailAddressEmailSubject: string | null;
  confirmEmailAddressEmailMessage: string | null;

  resetPasswordEmailSubject: string | null;
  resetPasswordEmailMessage: string | null;

  newUserAdminEmailSubject: string | null;
  newUserAdminEmailMessage: string | null;

  sesAccessKeyID: string | null;
  sesSecretAccessKey: string | null;
}

export interface ConfigMap<T extends string | number> {
  [key: string]: T | undefined;
}

export type ConfigKey = keyof Config;

export const ConfigDummy: Config = Object.freeze({
  systemFromEmail: null,
  adminNotificationEmails: null,

  confirmEmailAddressEmailSubject: null,
  confirmEmailAddressEmailMessage: null,

  resetPasswordEmailSubject: null,
  resetPasswordEmailMessage: null,

  newUserAdminEmailSubject: null,
  newUserAdminEmailMessage: null,

  sesAccessKeyID: null,
  sesSecretAccessKey: null,
});
