import Knex = require('knex');
import { UserRow, EventLogRow, MemberRow, EntryLogRow, MemberCurrentViewRow } from './tables';
import { deepFreeze, keys } from '../common/lib';
import { NullTablesType, getTables, getTableColumns } from './common';

export interface Tables {
  user: UserRow;
  event_log: EventLogRow;
  member: MemberRow;
  entry_log: EntryLogRow;
  member_current_view: MemberCurrentViewRow;
}

export const NullTables: NullTablesType<Tables> = deepFreeze({
  user: {
    id: null,
    role: null,
    name: null,
    email: null,
    password: null,
    flags: null,
    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
    deleted: null,
  },
  event_log: {
    id: null,
    status: null,
    from: null,
    to: null,
    cc: null,
    bcc: null,
    subject: null,
    html: null,
    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
  },
  member: {
    id: null,
    status: null,
    email: null,
    name: null,
    code: null,
    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
    deleted: null,
  },
  entry_log: {
    id: null,
    member_id: null,
    type: null,
    created_at: null,
  },
  member_current_view: {
    id: null,
    status: null,
    email: null,
    name: null,
    code: null,
    created_at: null,
    updated_at: null,
    created_by: null,
    updated_by: null,
    deleted: null,
    sign_in_time: null,
    sign_out_time: null,
  },
});

export const TableNames = keys(NullTables);

export const Tables = getTables(NullTables);

export const TableColumns = getTableColumns(NullTables);

export function qcol<TTable extends keyof Tables>(table: TTable, col: keyof Tables[TTable] | '*', alias?: string) {
  return `${alias || table}.${col}`;
}

export function col<TTable extends keyof Tables>(table: TTable, col: keyof Tables[TTable]) {
  return col;
}

// TODO: Generalise below...

interface QueryBuilder<Table> {
  where<ColumnName extends keyof Table>(columnName: ColumnName, value: Table[ColumnName]): QueryBuilder<Table>;
  whereNotNull<ColumnName extends keyof Table>(columnName: ColumnName): QueryBuilder<Table>;
  whereRaw(sql: string, ...bindings: (string | number | boolean)[]): QueryBuilder<Table>;

  orderBy(columnName: keyof Table, direction: 'asc' | 'desc'): QueryBuilder<Table>;
  limit(maxResults: number): QueryBuilder<Table>;

  results(): Promise<{ totalCount: number, items: Table[] }>;
}

interface Where<Table> {
  columnName: keyof Table;
  value: any;
}

interface WhereCol<Table> {
  columnName: keyof Table;
}

interface WhereRaw {
  sql: string;
  bindings: (string | number | boolean)[];
}

export function Query<TableName extends keyof Tables, Table extends Tables[TableName]>(knex: Knex, tableName: TableName): QueryBuilder<Table> {
  const where: Where<Table>[] = [];
  const whereNotNull: WhereCol<Table>[] = [];
  const whereRaw: WhereRaw[] = [];

  let limit: number | null = null;
  let orderBy: [keyof Table, 'asc' | 'desc'] | null = null;

  function apply(): Knex.QueryBuilder {
    const k = knex(tableName);

    where.forEach(({ columnName, value }) => {
      k.where(columnName, value);
    });

    whereNotNull.forEach(({ columnName }) => {
      k.whereNotNull(columnName);
    });

    whereRaw.forEach(({ sql, bindings }) => {
      k.whereRaw(sql, bindings);
    });

    return k;
  }

  const ret: QueryBuilder<Table> = {
    where(columnName, value) {
      where.push({ columnName, value });

      return ret;
    },

    whereNotNull(columnName) {
      whereNotNull.push({ columnName });

      return ret;
    },

    whereRaw(sql, ...bindings) {
      whereRaw.push({ sql, bindings });

      return ret;
    },

    orderBy(columnName, direction) {
      orderBy = [columnName, direction];

      return ret;
    },

    limit(maxResults) {
      limit = maxResults;

      return ret;
    },

    async results() {
      const [{ count }] = await apply().count('id').as('count');

      const k = apply().select('*');

      if (orderBy) {
        k.orderBy(orderBy[0], orderBy[1]);
      }

      if (limit) {
        k.limit(limit);
      }

      const items: Table[] = await k;

      return {
        totalCount: count,
        items,
      };
    },
  };

  return ret;
}
