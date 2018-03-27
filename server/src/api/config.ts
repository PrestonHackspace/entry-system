import { Env, AppConfig } from '../config';
import { ConfigApi } from '../common/api';
import { Api } from '../common/lib';
import { EntrySystemApiContext } from './common';
import { NewConfigValueRepository } from '../model/repositories/config_value';
import { RoleEnum, Roles } from '../common/model/user';

export function NewConfigApi({ trx, authenticatedUser, helper }: EntrySystemApiContext) {
  const configValueRepository = NewConfigValueRepository(trx, authenticatedUser.id);

  const api: Api & ConfigApi = {
    async bootstrap() {
      helper.roleCheck(Roles);

      return {
        baseUrl: AppConfig.BaseUrl,
        env: Env,
        demoMode: AppConfig.DemoMode,
      };
    },

    async getValues() {
      helper.roleCheck(RoleEnum.Admin);

      return await configValueRepository.getValues();
    },

    async setValue(key, value) {
      helper.roleCheck(RoleEnum.Admin);

      await configValueRepository.setValue(key, value);
    },
  };

  return api;
}
