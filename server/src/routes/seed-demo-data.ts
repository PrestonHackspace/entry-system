import Knex = require('knex');
import express = require('express');
import { NewUserRepository, InsertUserRecord } from '../model/repositories/user';
import { hashString } from '../api/helpers/user_helper';
import { NewConfigValueRepository } from '../model/repositories/config_value';
import { NewUserApi } from '../api/user';
import { PartialUser, AnonId, RoleEnum } from '../common/model/user';
import { EntrySystemApiContext } from '../api/common';
import { UUID } from '../common/lib';
import { NewApiHelper } from '../lib/api-helper';
import { PartialMemberDetailed } from '../common/model/member';
import { NewMemberApi } from '../api/member';
import { NewEntryLogRepository } from '../model/repositories/entry_log';

export default function (knex: Knex) {
  const app = express();

  app.get('/', async (req, res) => {
    await knex.transaction(async (trx) => {
      async function getContext(userId: UUID): Promise<EntrySystemApiContext> {
        const userRepository = NewUserRepository(trx, AnonId);

        const helper = NewApiHelper();

        helper.setRole('Admin');

        return {
          trx,
          authenticatedUser: await userRepository.getOne(userId),
          helper,
          sessionToken: '',
        };
      }

      try {
        const userRepository = NewUserRepository(trx, AnonId);

        const user: InsertUserRecord = {
          email: 'es-admin@example.com',
          role: RoleEnum.Admin,
          name: 'ES Admin Demo',
          password: await hashString('password'),
          flags: {
            email_verified: true,
          },
        };

        const adminUserId = await userRepository.insert(user);
        const adminUser = await userRepository.getOne(adminUserId);

        const configRepository = NewConfigValueRepository(trx, adminUserId);

        await configRepository.setValue('systemFromEmail', 'noreply@es.prestonhackspace.org.uk');
        await configRepository.setValue('adminNotificationEmails', 'cjdell@gmail.com');
        await configRepository.setValue('sesAccessKeyID', '');
        await configRepository.setValue('sesSecretAccessKey', '');

        const context = await getContext(adminUser.id);

        const memberApi = NewMemberApi(context);

        const members: PartialMemberDetailed[] = [
          {
            email: 'member1@example.com',
            name: 'Member 1',
            code: '111',
          },
          {
            email: 'member2@example.com',
            name: 'Member 2',
            code: '222',
          },
          {
            email: 'member1@example.com',
            name: 'Member 3',
            code: '333',
          },
        ];

        const memberResults = await Promise.all(members.map(memberApi.save));

        const userApi = NewUserApi(context);

        const users: PartialUser[] = [
          {
            name: 'Viewer 1',
            role: RoleEnum.Viewer,
            email: 'viewer1@example.com',
            newPassword: 'password',
            flags: {
              email_verified: true,
            },
          },
        ];

        await Promise.all(users.map(userApi.save));

        // Temp...
        const log = NewEntryLogRepository(trx, adminUserId);

        const [member] = memberResults;

        if (member.id) {
          const logId = await log.insert({
            member_id: member.id,
            type: 'SignIn',
          });

          console.log('LOG ID', logId);
        } else {
          throw new Error('No member!');
        }

        res.send('Demo data created');
      } catch (err) {
        console.error('error', err);

        res.status(500).send(err.message);

        throw err;
      }
    });
  });

  return app;
}
