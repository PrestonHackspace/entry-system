import Knex = require('knex');
import { UUID } from '../../common/lib';
import { NewConfigValueRepository } from '../../model/repositories/config_value';
import { SesAccessKey } from '../../lib/email-sender';
import { ConfigKey } from '../../common/model/config';
import { NewUserRepository } from '../../model/repositories/user';
import { RoleEnum } from '../../common/model/user';

export function NewConfigHelper(trx: Knex, operatingUserId: UUID) {
  const configValueRepository = NewConfigValueRepository(trx, operatingUserId);
  const userRepository = NewUserRepository(trx, operatingUserId);

  return {
    async getStringValue(key: ConfigKey): Promise<string> {
      const val = await configValueRepository.getValue(key);

      if (typeof val !== 'string') {
        // throw new Error(`No value defined for ${key}`);
        console.error(`No value defined for ${key}`);
        return `Please set a config value for ${key}`;
      }

      return val;
    },

    async getAdminEmails(): Promise<string[]> {
      const [email, users] = await Promise.all([
        configValueRepository.getValue('adminNotificationEmails'),
        userRepository.getAll({ roles: [RoleEnum.Admin] }),
      ]);

      const configEmails = email ? email.split(';') : [];
      const userEmails = users.items.map((u) => u.email);

      const emails = [...configEmails, ...userEmails];

      if (emails.length === 0) throw new Error('No admin email defined');

      return emails;
    },

    async getSystemFromEmail(): Promise<string> {
      const email = await configValueRepository.getValue('systemFromEmail');

      if (!email) throw new Error('No system from email defined');

      return email;
    },

    async getSesAccessKey(): Promise<SesAccessKey> {
      const [AccessKeyID, SecretAccessKey] = await Promise.all([
        configValueRepository.getValue('sesAccessKeyID'),
        configValueRepository.getValue('sesSecretAccessKey'),
      ]);

      if (!AccessKeyID || !SecretAccessKey) throw new Error('SES Access Keys not configured!');

      return {
        AccessKeyID,
        SecretAccessKey,
      };
    },
  };
}
