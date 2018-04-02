import * as sha256 from "fast-sha256";

export const HourMs = 60 * 60 * 1000;
export const DayMs = 24 * HourMs;

export interface ApiWrap<TContext> {
  apiName: string;

  api: (arg: TContext) => Api;
}

export interface Api {
  [methodName: string]: (...args: any[]) => Promise<any>;
}

export type Arg = string | number | boolean | ArgObject;

export type ArgObject = {
  [argName: string]: Arg;
};

export interface IncomingRequest {
  apiName: string;
  methodName: string;
  args: Arg[];
}

export interface ApiQueryRequest {
  apiName: string;
}

export interface ApiQueryResponse {
  methods: string[];
}

export function strip<T>(obj: T): T {
  return Object.freeze(JSON.parse(JSON.stringify(obj)));
}

export type Awaitable<T> = T | Promise<T>;

export type UUID = string;
export type Decimal = string;
export type JSONString = string;

export interface JSONStringTyped<T> extends String {
  doNotUseMe?: T;
}

export function jsonParse<T>(json: JSONStringTyped<T>) {
  return JSON.parse(json.toString()) as T;
}

export function formatDecimal(amount: number | string): Decimal {
  if (typeof amount === 'string') amount = parseFloat(amount);

  return amount.toFixed(2);
}

export function formatCurrency(amount: number | string) {
  // if (typeof amount === 'undefined') return undefined;
  if (typeof amount === 'string') amount = parseFloat(amount);

  return `£${amount.toFixed(2)}`;
}

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret = {} as Pick<T, K>;

  keys.forEach((key: K) => {
    const val = obj[key];

    if (typeof val !== 'undefined') {
      ret[key] = val;
    }
  });

  return ret;
}

export function unpartial<TFull>(dummy: TFull, obj: Partial<TFull>): TFull {
  const keys = Object.keys(dummy) as (keyof TFull)[];

  return mutate(dummy, (mutable) => {
    keys.forEach((key) => {
      const val = obj[key];

      if (typeof val === 'undefined') throw new Error(`You must enter a value for field "${key}"`);

      (mutable[key] as any) = val;
    });
  });
}

export function keys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function findOne<T, TProp extends keyof T>(arr: ReadonlyArray<T>, prop: TProp, value: T[TProp]): T | null {
  const results = arr.filter((elem) => elem[prop] === value);

  return results.length ? results[0] : null;
}

export function deepFreeze<T extends any>(o: T): T {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
      && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

export function freezeResults<T>(arr: T[]): ReadonlyArray<Readonly<T>> {
  return Object.freeze(arr.map(elem => Object.freeze(elem)));
}

export function freezeResult<T>(res: T): Readonly<T> {
  return Object.freeze(res);
}

export function mutableClone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

export function mutate<T>(obj: T, ...mutators: ((obj: T) => void)[]) {
  const mutable = mutableClone(obj);

  mutators.forEach((mutator) => mutator(mutable));

  return deepFreeze(mutable);
}

export function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export function humanError(args: { title: string, message: string }): Error {
  const err = new Error(args.message) as HumanError;
  err.title = args.title;
  return err;
}

export interface HumanError extends Error {
  title: string;
}

export function isHumanError(err: Error): err is HumanError {
  return err instanceof Error && typeof (err as any).title === 'string';
}

export interface ErrorResponse {
  status: 'Error',
  title?: string;
  message: string;
}

export const RegEx = {
  Email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
  Telephone: /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/,
  Postcode: /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/,
}

export type Validator<T> = {
  [P in keyof T]?: ((value: T[P] | undefined) => string | undefined)[];
}

export type ValidationResult<T> = {
  [P in keyof T]?: ValidationResultItem;
}

export interface ValidationResultItem {
  messages: string[],
  valid: boolean,
  showError: boolean,
}

export interface ValidationPair<T> {
  state: T;
  validation: ValidationResult<T>
}

export function validate<T>(model: T, validator: Validator<T>): ValidationPair<T> {
  return {
    state: model,
    validation: validateModel(model, validator),
  };
}

export function validateModel<T>(model: T, validator: Validator<T>): ValidationResult<T> {
  const res: ValidationResult<T> = {};

  for (const key in validator) {
    const result: ValidationResultItem = {
      messages: [],
      valid: true,
      showError: false,
    };

    const isSet = key in model;
    const prop = model[key];
    const propValidator = validator[key];

    if (propValidator) {
      result.messages = propValidator.map(f => f(prop)).filter(msg => !!msg) as string[];
    } else {
      result.messages = [];
    }

    result.valid = result.messages.length === 0;
    result.showError = !result.valid && isSet;

    res[key] = result;
  }

  return res;
}

export function getMessages(item?: ValidationResultItem) {
  if (!item) return [];

  if (item.showError) return item.messages;

  return [];
}

export function isValid<T>(result: ValidationResult<T> | null): [boolean, string[]] {
  if (result === null) return [true, []];

  const messages: string[] = [];

  for (const key in result) {
    const prop = result[key];

    if (prop) {
      messages.push(...prop.messages.map(m => `${key} ${m}`));
    }
  }

  return [messages.length === 0, messages];
}

export function templateString(template: string, objs: { [objName: string]: { [propName: string]: any } }) {
  return Object.keys(objs).reduce((str, objName) => {
    const obj = objs[objName];

    return Object.keys(obj).reduce((str, propName) => {
      const val = obj[propName];

      return str.replace(new RegExp(`{{${objName}.${propName}}}`, 'g'), val);
    }, str);
  }, template);
}

export function createSha256() {
  const hasher = new sha256.Hash();

  function digestAsBase64() {
    const hash = hasher.digest();
    return new Buffer(hash).toString('base64');
  }

  return {
    update: (data: Uint8Array) => hasher.update(data),
    digestAsBase64,
  };
}

// Warning! Removes padding as well!!!
function convertBase64ToUrlSafeBase64(s: string) {
  return s.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function hashString(stringData: string) {
  if (!stringData.length) {
    return '';
  }

  const data = new Buffer(stringData, 'utf8');
  const hash = createSha256();
  hash.update(data);
  return convertBase64ToUrlSafeBase64(hash.digestAsBase64());
}

export function hashArrayBuffer(arrayBuffer: ArrayBuffer) {
  const data = new Uint8Array(arrayBuffer);
  const hash = createSha256();
  hash.update(data);
  return convertBase64ToUrlSafeBase64(hash.digestAsBase64());
}

// function getObjectHash(obj: any): string {
//   return hashString(JSON.stringify(getNormalisedObject(obj)));
// }

// function getNormalisedObject(obj: any): Object {
//   if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;

//   if (Array.isArray(obj)) return obj.map(getNormalisedObject);

//   let sorted: any = {};

//   Object.keys(obj).sort().forEach(function (key) {
//     sorted[key] = getNormalisedObject(obj[key]);
//   });

//   return sorted;
// }

// function isEqual(a: any, b: any): boolean {
//   return getObjectHash(a) === getObjectHash(b);
// }

// // Unlike _.union() this does deep object comparison
// function union(a: Array<Object>, b: Array<Object>): Array<Object> {
//   if (a === null) return b ? b : [];
//   if (b === null) return a;

//   // concat a and b, compute hash=>o map, resolve back to array
//   let unionedSet = a.concat(b).reduce(function (memo, val) {
//     memo[getObjectHash(val)] = val;
//     return memo;
//   }, {});

//   return values(unionedSet);
// }

// // Unlike _.difference() this does deep object comparison
// function difference(a: Array<Object>, b: Array<Object>): Array<Object> {
//   if (a === null) return [];
//   if (b === null) return a;

//   let set = a.reduce(function (memo, val) {
//     memo[getObjectHash(val)] = val;
//     return memo;
//   }, {});

//   let differencedSet = b.reduce(function (memo, val) {
//     delete memo[getObjectHash(val)];
//     return memo;
//   }, set);

//   return values(differencedSet);
// }

// function values(set: any) {
//   return Object.keys(set).map((k) => set[k]);
// }
