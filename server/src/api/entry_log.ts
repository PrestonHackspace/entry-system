import moment = require('moment');
import { EntrySystemApiContext } from './common';
import { Api } from '../common/lib';
import { fromDateTimeUtcString, fromMoment } from '../common/lib/date';
import { EntryLogApi } from '../common/api';
import { NewEntryLogRepository } from '../model/repositories/entry_log';
import { RoleEnum } from '../common/model/user';
import { NewMemberRepository } from '../model/repositories/member';
import { EntryList, SignInResponse, SignOutResponse } from '../common/model/entry_log';
import { NewMemberHelper } from './helpers/member_helper';

export function NewEntryLogApi({ trx, authenticatedUser, helper }: EntrySystemApiContext): Api & EntryLogApi {
  const entryLogRepository = NewEntryLogRepository(trx, authenticatedUser.id);
  const memberRepository = NewMemberRepository(trx, authenticatedUser.id);
  const memberHelper = NewMemberHelper();

  /**
   * Midnight to midnight local time
   */
  const getDayRange = () => {
    const from = moment().local();

    from.hour(0);
    from.minute(0);
    from.second(0);
    from.millisecond(0);

    const to = from.clone().add(1, 'day');

    return {
      from: fromMoment(from),
      to: fromMoment(to),
    };
  };

  const getDayView: EntryLogApi['getDayView'] = async () => {
    helper.roleCheck(RoleEnum.Admin, RoleEnum.Viewer);

    const { from, to } = getDayRange();

    const view = await entryLogRepository.getView(from, to);

    const entryList: EntryList = {
      entries: view.items.map((row) => {
        const { sign_in_time, sign_out_time } = row;

        return {
          member_id: row.id,
          name: row.name,
          signInTime: sign_in_time ? fromDateTimeUtcString(sign_in_time) : null,
          signOutTime: sign_out_time ? fromDateTimeUtcString(sign_out_time) : null,
        };
      }),
    };

    return entryList;
  };

  const toggle: EntryLogApi['toggle'] = async (code) => {
    helper.roleCheck(RoleEnum.Admin, RoleEnum.Viewer);

    const memberRow = await memberRepository.getByCode(code);

    // if (!member) throw new Error(`Cannot find member with code "${code}"`);

    if (!memberRow) {
      return {
        type: 'MemberNotFound',
        code,
      };
    }

    const log = await entryLogRepository.getLastLogFor(memberRow.id);

    const type = log && log.type === 'SignIn' ? 'SignOut' : 'SignIn';

    await entryLogRepository.insert({
      member_id: memberRow.id,
      type,
    });

    return {
      type,
      member: memberHelper.toMember(memberRow),
      entryList: await getDayView(),
    } as (SignInResponse | SignOutResponse);
  };

  const signInWithNewMember: EntryLogApi['signInWithNewMember'] = async (code, name) => {
    helper.roleCheck(RoleEnum.Admin, RoleEnum.Viewer);

    const member_id = await memberRepository.insert({
      code,
      name,
      status: 'Approved',
      email: `${code}@example.com`,
    });

    await entryLogRepository.insert({
      member_id,
      type: 'SignIn',
    });

    const memberRow = await memberRepository.getOne(member_id);

    return {
      type: 'SignIn',
      member: memberHelper.toMember(memberRow),
      entryList: await getDayView(),
    };
  };

  return {
    getDayView,
    toggle,
    signInWithNewMember,
  };
}
