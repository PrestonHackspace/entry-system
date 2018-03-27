import { UserApi } from '../common/api';
import { NewUserRepository, UserQuery, UserRecord, UpdateUserRecord } from './../model/repositories/user';
import { Api, pick, strip } from '../common/lib';
import { EntrySystemApiContext } from './common';
import { checkString, NewUserHelper, hashString } from './helpers/user_helper';
import { User, RoleEnum, RoleGroups } from '../common/model/user';

async function toUser(user: UserRecord): Promise<User> {
  return Object.freeze({ ...pick(user, 'id', 'role', 'name', 'email', 'flags', 'created_at', 'updated_at') });
}

export function NewUserApi({ trx, authenticatedUser, helper }: EntrySystemApiContext) {
  const userRepository = NewUserRepository(trx, authenticatedUser.id);

  const userHelper = NewUserHelper(trx, authenticatedUser.id);

  const api: Api & UserApi = {
    async getAll(q, paging) {
      helper.roleCheck(RoleEnum.Admin);

      const query: UserQuery = {
        ...q,
      };

      const { items, totalCount } = await userRepository.getAll(query, paging);

      return {
        totalCount,
        items: await Promise.all(items.map(toUser)),
      };
    },

    async getOne(id) {
      helper.roleCheck(RoleGroups.Registered);

      return toUser(await userRepository.getOne(id));
    },

    async save(partialUser) {
      helper.roleCheck(RoleEnum.Admin);

      const { id, role, name, email, newPassword, flags } = partialUser;

      if (!id) {
        if (!role) throw new Error('Missing role');
        if (!name) throw new Error('Missing name');
        if (!email) throw new Error('Missing email');
        if (!newPassword) throw new Error('Missing password');

        const newId = await userHelper.registerUser({ role, name, email, newPassword, flags });

        return api.getOne(newId);
      } else {
        const password = newPassword ? await hashString(newPassword) : undefined;

        let toUpdate: UpdateUserRecord = strip({
          id,
          name,
          email,
          password,
          flags: {},
        });

        // Allow the Admin to change the role
        if (authenticatedUser.role === RoleEnum.Admin) {
          toUpdate = { ...toUpdate, role };
        }

        await userRepository.update(toUpdate);

        return api.getOne(id);
      }
    },

    async delete(id) {
      helper.roleCheck(RoleEnum.Admin);

      return await userRepository.delete(id);
    },

    async verify(userId, token) {
      helper.roleCheck(RoleEnum.Anon);

      const userRecord = await userHelper.verify(userId, token);

      const message = await assertReadyToLogin(userRecord);

      const readyToLogin = message === null;

      return {
        user: await api.getOne(userId),
        readyToLogin,
      };
    },

    async login(email, password) {
      helper.roleCheck(RoleEnum.Anon);

      const userRecord = await userRepository.getByEmail(email);

      if (!userRecord) return Promise.reject(new Error(`User not found with email "${email}"`));

      const res = await checkString(password, userRecord.password);

      if (!res) return Promise.reject(new Error(`Invalid password`));

      if (userRecord.flags.email_verified !== true) return Promise.reject(new Error(`Please check verification email sent to address "${email}".`));

      const message = await assertReadyToLogin(userRecord);

      if (message) throw new Error(message);

      const user = await toUser(userRecord);
      const sessionToken = `${userRecord.id}:${await hashString(userRecord.password)}`;

      return { user, sessionToken };
    },

    async sendResetPasswordEmail(email) {
      helper.roleCheck(RoleEnum.Anon);

      await userHelper.sendResetPasswordEmail(email);
    },

    async resetPassword(userId, token, newPassword) {
      helper.roleCheck(RoleEnum.Anon);

      const userRecord = await userHelper.resetPassword(userId, token, newPassword);

      return toUser(userRecord);
    },
  };

  async function assertReadyToLogin(userRecord: UserRecord): Promise<string | null> {
    return null;
  }

  return api;
}
