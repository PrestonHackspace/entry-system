import Knex = require('knex');
import express = require('express');
import { NewUserRepository, InsertUserRecord } from '../model/repositories/user';
import { hashString } from '../api/helpers/user_helper';
import { AnonId, RoleEnum } from '../common/model/user';

export default function (knex: Knex) {
  const app = express();

  app.get('/', async (req, res) => {
    await knex.transaction(async (trx) => {
      try {
        const userRepository = NewUserRepository(trx, AnonId);

        const adminUsers = await userRepository.getAll({ roles: [RoleEnum.Admin] });

        if (adminUsers.items.length > 0) throw new Error('Admin user already created!');

        const password = String((Math.random() * 1000000) | 0);

        const user: InsertUserRecord = {
          email: 'admin@example.com',
          role: RoleEnum.Admin,
          name: 'Admin',
          password: await hashString(password),
          flags: {
            email_verified: true,
          },
        };

        const adminUserId = await userRepository.insert(user);

        res.json({ adminUserId, password });
      } catch (err) {
        console.error('error', err);

        res.status(500).send(err.message);

        throw err;
      }
    });
  });

  return app;
}
