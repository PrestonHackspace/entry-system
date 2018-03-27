import express = require('express');
import Knex = require('knex');
import { ApiWrap, ApiQueryRequest, ApiQueryResponse, IncomingRequest, deepFreeze, isHumanError, ErrorResponse } from '../common/lib';
import { ApiHelper, NewApiHelper } from './api-helper';

export interface ApiContext {
  trx: Knex;
  helper: ApiHelper;
  sessionToken: string;
}

export function ApiServer<TContext extends ApiContext>(
  knex: Knex,
  apiConstructor: (args: ApiContext) => Promise<TContext>,
  finish: (context: TContext) => Promise<void>,
  apis: ApiWrap<TContext>[],
) {
  const app = express();

  function findApi(apiName: string) {
    const api = apis.find((api) => api.apiName === apiName);

    if (!api) throw new Error(`API not found "${apiName}"`);

    return api;
  }

  app.post('/query', async (req, res) => {
    const sessionToken = req.headers['x-session-token'];
    const helper = NewApiHelper();

    if (Array.isArray(sessionToken)) throw new Error('Session token is array');

    const { apiName }: ApiQueryRequest = req.body;

    try {
      const api = findApi(apiName);

      await knex.transaction(async (trx) => {
        const context = await apiConstructor({ trx, sessionToken, helper });

        const response: ApiQueryResponse = {
          methods: Object.keys(api.api(context)),
        };

        res.json(response);
      });
    } catch (err) {
      res.status(500).json({ message: err.message || 'API Query Error' });
    }
  });

  app.post('/invoke', async (req, res) => {
    const sessionToken = req.headers['x-session-token'];
    const helper = NewApiHelper();

    const { apiName, methodName, args }: IncomingRequest = req.body;

    deepFreeze(args);

    try {
      if (Array.isArray(sessionToken)) throw new Error('Session token is array');

      const api = findApi(apiName);

      await knex.transaction(async (trx) => {
        const context = await apiConstructor({ trx, sessionToken, helper });

        const apiResponse = await api.api(context)[methodName](...args);

        if (!helper.hasCheckedRole()) throw new Error(`API "${apiName}.${methodName}" failed to perform a role check!`);

        await finish(context);

        if (typeof apiResponse !== 'undefined' || apiResponse === null) {
          res.json(apiResponse);
        } else {
          res.json({ status: 'OK' });
        }
      });
    } catch (err) {
      let errorResponse: ErrorResponse;

      if (isHumanError(err)) {
        errorResponse = { status: 'Error', title: err.title, message: err.message };
      } else {
        errorResponse = { status: 'Error', message: err.message || 'API Error' };
      }

      res.status(500).json(errorResponse);
    }
  });

  return app;
}
