import { MemberApi } from '../common/api';
import { NewMemberRepository, InsertMemberRecord, UpdateMemberRecord } from './../model/repositories/member';
import { Api, strip } from '../common/lib';
import { EntrySystemApiContext } from './common';
import { MemberDetailed } from '../common/model/member';
import { RoleEnum, RoleGroups } from '../common/model/user';
import { NewMemberHelper } from './helpers/member_helper';
import { DateTimeUtcString } from '../common/lib/date';

export function NewMemberApi({ trx, authenticatedUser, helper }: EntrySystemApiContext) {
  const memberRepository = NewMemberRepository(trx, authenticatedUser.id);
  const memberHelper = NewMemberHelper();

  const api: Api & MemberApi = {
    async getAll(query, paging) {
      helper.roleCheck(RoleGroups.Registered);

      const { items, totalCount } = await memberRepository.getAll(query, paging);

      return {
        totalCount,
        items: await Promise.all(items.map((item) => memberHelper.toMember(item))),
      };
    },

    async getNew() {
      helper.roleCheck(RoleEnum.Admin);

      return {};
    },

    async getOne(id) {
      helper.roleCheck(RoleEnum.Anon, RoleEnum.Admin);

      const memberRow = await memberRepository.getOne(id);

      const member = memberHelper.toMember(memberRow);

      const memberDetailed: MemberDetailed = {
        ...member,
      };

      return memberDetailed;
    },

    async save(partialMember) {
      helper.roleCheck(RoleEnum.Admin);

      const {
        id,
        email,
        name,
        code,
        updated_at,
      } = partialMember;

      if (!id) {
        if (!email) throw new Error('Missing email');
        if (!name) throw new Error('Missing name');
        if (!code) throw new Error('Missing code');

        const toInsert: InsertMemberRecord = strip({
          status: 'Approved' as 'Approved',
          email,
          name,
          code,
        });

        const newId = await memberRepository.insert(toInsert);

        return api.getOne(newId);
      } else {
        const previousMemberRecord = await memberRepository.getOne(id);
        checkNotStale(previousMemberRecord.updated_at, updated_at);

        const toUpdate: UpdateMemberRecord = strip({
          id,
          email,
          name,
          code,
        });

        await memberRepository.update(toUpdate);

        return api.getOne(id);
      }
    },

    async delete(id) {
      helper.roleCheck(RoleEnum.Admin);

      return await memberRepository.delete(id);
    },
  };

  return api;

  function checkNotStale(current_updated_at: DateTimeUtcString, form_updated_at: DateTimeUtcString | undefined) {
    if (form_updated_at) {
      if (form_updated_at !== current_updated_at) {
        throw new Error('Member has been updated by another user. Please refresh.');
      }
    }
  }
}
