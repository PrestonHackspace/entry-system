import * as _ from 'lodash';
import { Role } from '../common/model/user';

export interface ApiHelper {
  setRole(role: Role): void;
  roleCheck(...roleList: (string | string[])[]): void;
  hasCheckedRole(): boolean;
}

export function NewApiHelper(): ApiHelper {
  let _role: string | null = null;
  let hasCheckedRole = false;

  return {
    setRole(role) {
      if (_role !== null) throw new Error('Cannot set role twice!');

      _role = role;
    },

    roleCheck(...roleList: (string | string[])[]) {
      if (_role === null) throw new Error('Role not set!');

      const roles = _.flatten(roleList);

      hasCheckedRole = true;

      const canAccess = roles.indexOf(_role) !== -1;

      if (!canAccess) throw new Error(`Role of "${_role}" cannot access this resource. Requires "${roles.join('", "')}"`);
    },

    hasCheckedRole() {
      return hasCheckedRole;
    },
  };
}
