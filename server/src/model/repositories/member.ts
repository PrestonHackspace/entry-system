import Knex = require('knex');
import uuid = require('uuid');
import { Paging } from '../../common/api';
import { UUID, freezeResults } from '../../common/lib';
import { MemberStatus } from '../../common/model/member';
import { MemberRow } from '../tables';
import { Tables, TableColumns, Query } from '../keys';
import { toDateTimeUtcString, now } from '../../common/lib/date';

const Table = Tables.member;

const { member } = TableColumns;

export function NewMemberRepository(knex: Knex, operatingUserId: UUID) {
  return {
    async getAll(query: {}, paging?: Paging) {
      const commonChain = knex(Table)
        .where(member.deleted, false);

      const [{ count }] = await commonChain.clone()
        .count('id').as('count');

      let chain = commonChain.clone()
        .select(member.all)
        .orderBy(member.created_at, 'desc');

      if (paging) {
        chain = chain.offset(paging.skip).limit(paging.take);
      }

      const items: MemberRow[] = await chain;

      return {
        totalCount: parseInt(count, 10),
        items: freezeResults(items),
      };
    },

    async getOne(id: UUID) {
      const members: MemberRow[] = await knex(Table)
        .where({ id })
        .where(member.deleted, false)
        .select(member.all);

      if (members.length === 0) throw new Error(`Member not found with ID: "${id}"`);

      return members[0];
    },

    async getByCode(code: string) {
      const results = await Query(knex, Tables.member)
        .where(TableColumns.member.code, code)
        .limit(1)
        .results();

      if (results.items.length) {
        return results.items[0];
      }

      return null;
    },

    async insert(toInsert: InsertMemberRecord) {
      const time = toDateTimeUtcString(now());

      const record: MemberRow = {
        id: uuid.v1(),
        ...toInsert,
        created_at: time,
        updated_at: time,
        created_by: operatingUserId,
        updated_by: operatingUserId,
        deleted: false,
      };

      await knex(Table).insert(record);

      return record.id;
    },

    async update(toUpdate: UpdateMemberRecord) {
      const time = toDateTimeUtcString(now());

      const record: Partial<MemberRow> = {
        ...toUpdate,
        updated_at: time,
      };

      await knex(Table)
        .where({ id: toUpdate.id })
        .update(record);
    },

    async delete(id: UUID) {
      const record: Partial<MemberRow> = {
        deleted: true,
      };

      await knex(Table).where({ id }).update(record);
    },

    async setStatus(id: UUID, status: MemberStatus) {
      const where: Partial<MemberRow> = { id };
      const update: Partial<MemberRow> = { status };

      await knex(Table).where(where).update(update);
    },
  };
}

export interface InsertMemberRecord {
  readonly status: MemberStatus;
  readonly email: string;
  readonly name: string;
  readonly code: string;
}

export interface UpdateMemberRecord {
  readonly id: UUID;

  readonly status?: MemberStatus;
  readonly email?: string;
  readonly name?: string;
}
