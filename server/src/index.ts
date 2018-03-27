import { EntrySystemApiContext } from './api/common';
import { AnonId, RoleEnum } from './common/model/user';
import path = require('path');
import express = require('express');
import bodyParser = require('body-parser');
import Knex = require('knex');
import pg = require('pg');
import fs = require('fs-extra-promise');
import cors = require('cors');
import knexfile = require('./knexfile');
import { NewConfigApi } from './api/config';
import { NewUserApi } from './api/user';
import { ApiServer } from './lib/api-server';
import { NewUserRepository } from './model/repositories/user';
import { NewMemberApi } from './api/member';
import { NewEventLogApi } from './api/event_log';
import { NewEventLogHelper } from './api/helpers/event_log_helper';
import { checkString } from './api/helpers/user_helper';
import seedDemoData from './routes/seed-demo-data';
import seedAdmin from './routes/seed-admin';
import { NewApiHelper } from './lib/api-helper';
import { NewEntryLogApi } from './api/entry_log';

async function init() {
  try {
    const env = (process.env.NODE_ENV as 'development' | 'staging' | 'production' | undefined) || 'development';

    const knex: Knex = Knex(knexfile[env]);

    pg.types.setTypeParser(1082, parseDate); // date

    // Don't automatically parse date time values (timezone issues). Keep it as UTC
    pg.types.setTypeParser(1114, parseDateTimeWithoutTimezone); // timestamp without timezone
    pg.types.setTypeParser(1184, parseDateTime); // timestamp

    // Don't automatically parse JSON into an object, we will do that ourselves (mirror INSERT/UPDATE behaviour)
    pg.types.setTypeParser(3802, parseJson);
    pg.types.setTypeParser(114, parseJson);

    function parseDate(str: string) {
      return str;
    }

    function parseDateTimeWithoutTimezone(str: string) {
      return str;
    }

    function parseDateTime(str: string) {
      return str;
    }

    function parseJson(str: string) {
      return str;
    }

    const ui = path.join(__dirname, '..', '..', 'client', 'assets');

    const app = express();

    app.use(cors());

    app.set('trust proxy', true);

    // Trim WWW
    app.use((req, res, next) => {
      if (req.headers.host.slice(0, 4) === 'www.') {
        const newHost = req.headers.host.slice(4);

        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
      }

      next();
    });

    // For parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // For parsing application/json
    app.use(bodyParser.json());

    app.use(express.static(ui));

    const apiServer = ApiServer(
      knex,

      async ({ trx, helper, sessionToken }): Promise<EntrySystemApiContext> => {
        const userRepository = NewUserRepository(trx, AnonId);

        async function getAuthenticatedUser() {
          if (sessionToken && sessionToken.length) {
            const [userId, hashedHash] = sessionToken.split(':');

            const user = await userRepository.getOne(userId);

            if (user) {
              const valid = checkString(user.password, hashedHash);

              if (!valid) throw new Error('Invalid session token!');

              return user;
            }
          }

          return userRepository.getOne(AnonId);
        }

        const authenticatedUser = await getAuthenticatedUser();

        helper.setRole(authenticatedUser.role);

        return {
          trx,
          sessionToken,
          helper,
          authenticatedUser,
        };
      },

      async ({ trx, authenticatedUser }) => {
        const eventLogHelper = NewEventLogHelper(trx, authenticatedUser.id);

        await eventLogHelper.sendPending();
      },

      [
        { apiName: 'ConfigApi', api: NewConfigApi },
        { apiName: 'EventLogApi', api: NewEventLogApi },
        { apiName: 'UserApi', api: NewUserApi },
        { apiName: 'MemberApi', api: NewMemberApi },
        { apiName: 'EntryLogApi', api: NewEntryLogApi },
      ],
    );

    app.use('/api', apiServer);

    async function getContext(userId = AnonId): Promise<EntrySystemApiContext> {
      const userRepository = NewUserRepository(knex, AnonId);

      const helper = NewApiHelper();

      helper.setRole(RoleEnum.Anon);

      return {
        trx: knex,
        authenticatedUser: await userRepository.getOne(userId),
        helper,
        sessionToken: '',
      };
    }

    app.get('/health', async (req, res) => {
      res.send('OK');
    });

    app.get('/verify', async (req, res) => {
      const { user_id, token } = req.query;

      try {
        if (typeof user_id !== 'string') throw new Error('Invalid user ID');
        if (typeof token !== 'string') throw new Error('Invalid token');

        await knex.transaction(async (trx) => {
          const context = await getContext(user_id);

          const userApi = NewUserApi(context);

          const { user, readyToLogin } = await userApi.verify(user_id, token);

          console.log(`Verification successful: ${user.name}`);

          if (readyToLogin) {
            res.redirect('/#verify-success-ready');
          } else {
            res.redirect('/#verify-success-not-ready');
          }
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.get('/reset_password', async (req, res) => {
      const { user_id, token } = req.query;

      try {
        if (typeof user_id !== 'string') throw new Error('Invalid user ID');
        if (typeof token !== 'string') throw new Error('Invalid token');

        await knex.transaction(async (trx) => {
          const context = await getContext(user_id);

          const userApi = NewUserApi(context);

          const user = await userApi.resetPassword(user_id, token, '');

          console.log(`Password reset: ${user.name}`);

          res.redirect('/#password-reset');
        });
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.get('/event-log/:id', async (req, res) => {
      try {
        const context = await getContext();

        const eventLogApi = NewEventLogApi(context);

        const log = await eventLogApi.getOne(req.params.id);

        res.type('html').send(log.html);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    app.use('/seed-demo-data', seedDemoData(knex));
    app.use('/seed-admin', seedAdmin(knex));

    app.use(async (req, res) => {
      const html = await fs.readFileAsync(path.join(ui, 'index.html'));

      res.header('content-type', 'text/html');
      res.send(html);
    });

    const port = env === 'production' ? 8085 : 8084;

    app.listen(port, () => {
      console.log(`ES server now listening on port ${port}!`);
    });

  } catch (err) {
    console.error(err);
  }
}

init();
