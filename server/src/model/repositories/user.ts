import Knex = require('knex');
import uuid = require('uuid');
import { Paging } from '../../common/api';
import { UUID, freezeResults, freezeResult, pick, strip, jsonParse } from '../../common/lib';
import { Role, UserFlags, AnonId } from '../../common/model/user';
import { UserRow } from '../tables';
import { TableColumns, Tables } from '../keys';
import { toDateTimeUtcString, now, DateTimeUtcString } from '../../common/lib/date';

const Table = Tables.user;

const { user } = TableColumns;

export interface UserQuery {
  roles?: Role[];
  dealership_ids?: ReadonlyArray<UUID>;
}

function toRecord(row: UserRow): UserRecord {
  const { deleted, ..._row } = row;

  return {
    ..._row,
    flags: jsonParse(row.flags),
  };
}

export function NewUserRepository(knex: Knex, operatingUserId: UUID) {

  return {
    async getAll(query: UserQuery, paging?: Paging) {
      let commonChain = knex(Table)
        .where(user.id, '!=', AnonId)
        .where(user.name, '!=', 'DELETED')
        .where(user.deleted, false);

      if (query.roles) {
        commonChain = commonChain.whereIn(user.role, query.roles);
      }

      let countChain = commonChain.clone()
        .count(user.id).as('count');

      let chain = commonChain.clone()
        .select(user.all)
        .orderBy(user.created_at, 'desc');


      if (paging) {
        chain = chain.offset(paging.skip).limit(paging.take);
      }

      const [{ count }] = await countChain;
      const rows: UserRow[] = await chain;

      const records = rows.map(toRecord);

      return {
        totalCount: parseInt(count, 10),
        items: freezeResults(records),
      };
    },

    async getOne(id: UUID) {
      const users: UserRow[] = await knex(Table)
        .where({ id })
        .where(user.deleted, false)
        .select(user.all);

      if (users.length === 0) throw new Error(`User not found with ID: "${id}"`);

      return Object.freeze(toRecord(users[0]));
    },

    async getEmailExists(email: string) {
      const [{ count }] = await knex(Table)
        .where({ [user.email]: email })
        .count(user.id).as('count');

      return count > 0;
    },

    async getByEmail(email: string) {
      const users: UserRow[] = await knex(Table)
        .where({ [user.email]: email })
        .select('*');

      if (users.length === 0) return null;

      return freezeResult(toRecord(users[0]));
    },

    async insert(toInsert: InsertUserRecord) {
      const time = toDateTimeUtcString(now());

      const record: UserRow = {
        id: uuid.v1(),
        ...pick(toInsert, 'role', 'name', 'email', 'password'),
        flags: JSON.stringify(toInsert.flags),
        created_at: time,
        updated_at: time,
        created_by: operatingUserId,
        updated_by: operatingUserId,
        deleted: false,
      };

      await knex(Table).insert(record);

      return record.id;
    },

    async update(toUpdate: UpdateUserRecord) {
      let flagsToUpdate: UserFlags | undefined;

      if (Object.keys(toUpdate.flags)) {
        const [{ flags }]: UserRow[] = await knex(Table).where({ id: toUpdate.id }).select(user.flags);

        const oldFlags = jsonParse(flags);

        flagsToUpdate = {
          ...oldFlags,
          ...strip(toUpdate.flags),
        };
      }

      let record: Partial<UserRow> = {
        ...pick(toUpdate, 'role', 'name', 'email', 'password'),
        updated_at: toDateTimeUtcString(now()),
        updated_by: operatingUserId,
      };

      if (flagsToUpdate) {
        record = {
          ...record,
          flags: JSON.stringify(flagsToUpdate),
        };
      }

      await knex(Table).where({ id: toUpdate.id }).update(record);
    },

    async delete(id: UUID) {
      const record: Partial<UserRow> = {
        deleted: true,
      };

      await knex(Table).where({ id }).update(record);
    },
  };
}

export interface UserRecord {
  readonly id: UUID;

  readonly role: Role;
  readonly name: string;
  readonly email: string;
  readonly password: string;

  readonly flags: UserFlags;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;

  readonly created_by: UUID;
  readonly updated_by: UUID;
}

export interface InsertUserRecord {
  readonly role: Role;
  readonly name: string;
  readonly email: string;
  readonly password: string;

  readonly flags: UserFlags;
}

export interface UpdateUserRecord {
  readonly id: UUID;

  readonly role?: Role;
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;

  readonly flags: UserFlags;
}
