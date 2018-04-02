import Knex = require('knex');
import uuid = require('uuid');
import { Paging } from '../../common/api';
import { UUID, deepFreeze } from '../../common/lib';
import { EventLogRow } from '../tables';
import { TableColumns, Tables } from '../keys';
import { toDateTimeUtcString, now } from '../../common/lib/date';

const Table = Tables.event_log;
const { event_log } = TableColumns;

export function NewEventLogRepository(knex: Knex, operatingUserId: UUID) {
  return {
    async getAll(query: {}, paging: Paging) {
      const items: EventLogRow[] = await knex(Table)
        .select('*')
        .orderBy(event_log.created_at, 'desc')
        .offset(paging.skip)
        .limit(paging.take);

      const [countResult] = await knex(Table)
        .count(event_log.id).as('count');

      return deepFreeze({ items, totalCount: parseInt(countResult['count'], 10) });
    },

    async getOne(id: UUID) {
      const eventLog: EventLogRow[] = await knex(Table)
        .where({ id })
        .select('*');

      if (eventLog.length === 0) throw new Error(`EventLog not found with ID: "${id}"`);

      return deepFreeze(eventLog[0]);
    },

    async getByStatus(status: 'Pending' | 'Sent') {
      const where: Partial<EventLogRow> = {
        status,
      };

      const eventLogs: EventLogRow[] = await knex(Table)
        .where(where)
        .select('*');

      return deepFreeze(eventLogs);
    },

    async insert(toInsert: InsertEventLogRecord) {
      const time = toDateTimeUtcString(now());

      const record: EventLogRow = {
        id: uuid.v1(),
        status: 'Pending',
        ...toInsert,
        created_at: time,
        updated_at: time,
        created_by: operatingUserId,
        updated_by: operatingUserId,
      };

      await knex(Table).insert(record);

      return record.id;
    },

    async setStatus(id: UUID, status: 'Pending' | 'Sent' | 'Failed') {
      const time = toDateTimeUtcString(now());

      const record: Partial<EventLogRow> = {
        status,
        updated_at: time,
        updated_by: operatingUserId,
      };

      await knex(Table)
        .where({ id })
        .update(record);
    },
  };
}

export interface InsertEventLogRecord {
  readonly from: string;
  readonly to: string;
  readonly cc: string | null;
  readonly bcc: string | null;
  readonly subject: string;
  readonly html: string;
}
