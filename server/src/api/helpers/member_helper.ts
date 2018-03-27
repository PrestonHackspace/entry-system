import { Member } from '../../common/model/member';
import { pick } from '../../common/lib';
import { MemberRow } from '../../model/tables';

export function NewMemberHelper() {
  return {
    toMember(m: MemberRow): Member {
      return Object.freeze({ ...pick(m, 'id', 'status', 'email', 'name', 'code', 'created_at', 'updated_at') });
    },
  };
}
