import Knex = require('knex');
import bcrypt = require('bcrypt');
import { UUID, pick, strip, templateString } from '../../common/lib';
import { NewUserRepository, InsertUserRecord, UserRecord } from '../../model/repositories/user';
import { getStatusEmailHtml } from '../../email/index';
import { NewEventLogHelper } from './event_log_helper';
import { Role, UserFlags } from '../../common/model/user';
import { AppConfig } from '../../config';
import { NewConfigHelper } from './config_helper';
import { formatDate } from '../../common/lib/date';

const SaltRounds = 10;

export function hashString(str: string) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(str, SaltRounds, (err, hash) => {
      if (err) return reject(err);

      return resolve(hash);
    });
  });
}

export function checkString(str: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(str, hash, (err, res) => {
      if (err) return reject(err);

      return resolve(res);
    });
  });
}

interface RegisterUserRequest {
  role: Role;
  name: string;
  email: string;
  newPassword: string;
  flags: UserFlags;
}

export function NewUserHelper(trx: Knex, operatingUserId: UUID) {
  const configHelper = NewConfigHelper(trx, operatingUserId);
  const eventLogHelper = NewEventLogHelper(trx, operatingUserId);
  const userRepository = NewUserRepository(trx, operatingUserId);

  async function sendConfirmationEmail(userId: UUID) {
    const user = await userRepository.getOne(userId);

    const email_verification_token = String((Math.random() * 1000000) | 0);

    await userRepository.update({
      id: userId,
      flags: {
        email_verification_token,
      },
    });

    let subject = await configHelper.getStringValue('confirmEmailAddressEmailSubject');
    let message = await configHelper.getStringValue('confirmEmailAddressEmailMessage');

    subject = templateString(subject, { user });
    message = templateString(message, { user });

    const html = getStatusEmailHtml({
      title: subject,
      previewText: message,
      message,
      rightButton: {
        label: 'Confirm Email',
        link: `${AppConfig.BaseUrl}/verify?user_id=${encodeURIComponent(user.id)}&token=${encodeURIComponent(email_verification_token)}`,
      },
    });

    const to = [user.email];

    await eventLogHelper.enqueueEmail({ to, subject, html });
  }

  async function sendNewUserAdminEmail(userId: UUID) {
    const user = await userRepository.getOne(userId);

    let subject = await configHelper.getStringValue('newUserAdminEmailSubject');
    let message = await configHelper.getStringValue('newUserAdminEmailMessage');

    subject = templateString(subject, { user, dates: { created_at: formatDate(user.created_at) } });
    message = templateString(message, { user, dates: { created_at: formatDate(user.created_at) } });

    // const subject = `A new user has registered: ${user.name} (${user.email})`;
    // const message = `<p>A new user has registered, details are as follows:</p>

    // <p>User name: ${user.name}</p>
    // <p>Email: ${user.email}</p>
    // <p>Sign up date: ${formatDate(user.created_at)}</p>`;

    const html = getStatusEmailHtml({
      title: subject,
      previewText: message,
      message,
      rightButton: {
        label: 'View',
        link: `${AppConfig.BaseUrl}/users/${userId}`,
      },
    });

    const to = await configHelper.getAdminEmails();

    await eventLogHelper.enqueueEmail({ to, subject, html });
  }

  async function generateTokenAndSendResetPasswordEmail(user: UserRecord) {
    const email_verification_token = String((Math.random() * 1000000) | 0);

    await userRepository.update({
      id: user.id,
      flags: {
        email_verification_token,
      },
    });

    let subject = await configHelper.getStringValue('resetPasswordEmailSubject');
    let message = await configHelper.getStringValue('resetPasswordEmailMessage');

    const html = getStatusEmailHtml({
      title: subject,
      previewText: message,
      message,
      rightButton: {
        label: 'Reset Password',
        link: `${AppConfig.BaseUrl}/password/reset/${encodeURIComponent(user.id)}/${encodeURIComponent(email_verification_token)}`,
      },
    });

    subject = templateString(subject, { user });
    message = templateString(message, { user });

    const to = [user.email];

    await eventLogHelper.enqueueEmail({ to, subject, html });
  }

  return {
    async registerUser(req: RegisterUserRequest): Promise<UUID> {
      if (await userRepository.getEmailExists(req.email) === true) {
        throw new Error(`The email "${req.email}" has already been registered with the system.`);
      }

      const password = await hashString(req.newPassword);

      const toInsert: InsertUserRecord = strip({
        ...pick(req, 'role', 'name', 'email', 'flags'),
        password,
      });

      const newId = await userRepository.insert(toInsert);

      await sendConfirmationEmail(newId);
      await sendNewUserAdminEmail(newId);

      return newId;
    },

    async verify(userId: UUID, token: string): Promise<UserRecord> {
      const user = await userRepository.getOne(userId);

      const { email_verification_token } = user.flags;

      if (token !== email_verification_token) throw new Error('Invalid token. Please re-register.');

      await userRepository.update({
        id: userId,
        flags: {
          // email_verification_token: undefined,
          email_verified: true,
        },
      });

      return user;
    },

    async sendResetPasswordEmail(email: string): Promise<UserRecord> {
      const userRecord = await userRepository.getByEmail(email);

      if (!userRecord) return Promise.reject(new Error(`User not found with email "${email}"`));

      await generateTokenAndSendResetPasswordEmail(userRecord);

      return await userRepository.getOne(userRecord.id);
    },

    async resetPassword(userId: UUID, token: string, newPassword: string): Promise<UserRecord> {
      const userRecord = await userRepository.getOne(userId);

      const { email_verification_token } = userRecord.flags;

      if (token !== email_verification_token) throw new Error('Invalid token. Please try again.');

      const password = await hashString(newPassword);

      await userRepository.update({
        id: userId,
        password,
        flags: {},
      });

      return await userRepository.getOne(userRecord.id);
    },
  };
}
