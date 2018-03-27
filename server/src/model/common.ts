import { deepFreeze, keys } from '../common/lib';

export interface PaginatedResult<T> {
  items: ReadonlyArray<T>;
  totalCount: number;
}

export type NullTablesType<T> = {
  [P in keyof T]: NullProperties<T[P]>;
};

type NullProperties<T> = {
  [P in keyof T]: null;
};

type TablesEnum<O> = {
  readonly [K in keyof O]: K;
};

export function getTables<O>(o: O): TablesEnum<O> {
  const ks = keys(o);

  return deepFreeze(ks.reduce((res, key) => {
    res[key] = key;
    return res;
  }, {} as any));
}

type TableColumnsEnum<O> = {
  readonly [K in keyof O]: ColumnsEnum<O[K]> & { all: 'all' };
};

type ColumnsEnum<O> = {
  readonly [K in keyof O]: K;
};

export function getTableColumns<O>(o: O): TableColumnsEnum<O> {
  const ks = keys(o);

  return deepFreeze(ks.reduce((res, key) => {
    res[key] = getColumns(key, o[key]);
    return res;
  }, {} as any));
}

function getColumns<O>(t: string, o: O): ColumnsEnum<O> {
  const ks = keys(o);

  return deepFreeze(ks.reduce((res, key) => {
    res[key] = `${t}.${key}`;
    return res;
  }, { 'all': `${t}.*` } as any));
}

export interface Where {
  [col: string]: string | number | boolean | null;
}
