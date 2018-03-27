import { EventLogApi } from '../common/api';
import { NewEventLogRepository } from './../model/repositories/event_log';
import { Api, pick, deepFreeze } from '../common/lib';
import { EntrySystemApiContext } from './common';
import { EventLogRow } from '../model/tables';
import { EventLog } from '../common/model/event_log';
import { RoleEnum } from '../common/model/user';

async function toEventLog(eventLog: EventLogRow): Promise<EventLog> {
  return deepFreeze({ ...pick(eventLog, 'id', 'status', 'from', 'to', 'cc', 'bcc', 'subject', 'html', 'created_at', 'updated_at') });
}

export function NewEventLogApi({ trx, authenticatedUser, helper }: EntrySystemApiContext): Api & EventLogApi {
  const eventLogRepository = NewEventLogRepository(trx, authenticatedUser.id);

  return {
    async getAll(query, paging) {
      helper.roleCheck(RoleEnum.Admin);

      const { items, totalCount } = await eventLogRepository.getAll(query, paging);

      return {
        totalCount,
        items: await Promise.all(items.map(toEventLog)),
      };
    },

    async getOne(id) {
      return toEventLog(await eventLogRepository.getOne(id));
    },
  };
}
