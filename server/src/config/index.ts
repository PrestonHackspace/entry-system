import { Envs } from '../common/model/config';

export const Env = process.env.NODE_ENV as Envs || 'development';

interface Environment {
  BaseUrl: string;
  DemoMode: boolean;
  SES: {
    Region: string,
  };
}

interface Environments {
  [env: string]: () => Environment;
}

const Environments: Environments = {
  development: () => ({
    BaseUrl: 'http://localhost:8084',
    DemoMode: true,
    SES: {
      Region: 'eu-west-1',
    },
  }),

  staging: () => ({
    BaseUrl: 'https://test.es.prestonhackspace.org.uk',
    DemoMode: true,
    SES: {
      Region: 'eu-west-1',
    },
  }),

  production: () => ({
    BaseUrl: 'https://es.prestonhackspace.org.uk',
    DemoMode: false,
    SES: {
      Region: 'eu-west-1',
    },
  }),
};

export const AppConfig = Environments[Env]();
