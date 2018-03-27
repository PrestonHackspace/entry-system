import Knex = require('knex');
import uuid = require('uuid');
import { Tables, TableColumns, Query } from '../keys';
import { UUID } from '../../common/lib';
import { MemberCurrentViewRow, EntryLogRow } from '../tables';
import { PaginatedResult } from '../common';
import { EntryType } from '../../common/model/entry_log';
import { jsDateToDateTimeUtcString, DateTime, toDateTimeUtcString } from '../../common/lib/date';

export function NewEntryLogRepository(knex: Knex, operatingUserId: UUID) {
  return {
    async getView(from: DateTime, to: DateTime): Promise<PaginatedResult<MemberCurrentViewRow>> {
      const fromString = toDateTimeUtcString(from);
      const toString = toDateTimeUtcString(to);

      console.log('from', fromString, 'to', toString);

      const filterSql = `
        (${TableColumns.member_current_view.sign_out_time} IS NULL)
        OR
        (
          ${TableColumns.member_current_view.sign_in_time} >= ?::timestamp without time zone
          AND
          ${TableColumns.member_current_view.sign_out_time} <= ?::timestamp without time zone
        )
      `;

      console.log(filterSql);

      return Query(knex, Tables.member_current_view)
        .where(TableColumns.member_current_view.deleted, false)
        .whereNotNull(TableColumns.member_current_view.sign_in_time)
        .whereRaw(filterSql, fromString, toString)
        .orderBy(TableColumns.member_current_view.sign_in_time, 'desc')
        .results();
    },

    async insert(toInsert: InsertEntryLogRecord) {
      const time = jsDateToDateTimeUtcString(new Date());

      const record: EntryLogRow = {
        id: uuid.v1(),
        ...toInsert,
        created_at: time,
      };

      await knex(Tables.entry_log).insert(record);

      return record.id;
    },

    async getLastLogFor(member_id: string) {
      const results = await Query(knex, Tables.entry_log)
        .where(TableColumns.entry_log.member_id, member_id)
        .orderBy(TableColumns.entry_log.created_at, 'desc')
        .limit(1)
        .results();

      if (results.items.length) {
        return results.items[0];
      }

      return null;
    },
  };
}

export interface InsertEntryLogRecord {
  readonly member_id: UUID;
  readonly type: EntryType;
}
