import moment = require('moment');
import { Moment } from 'moment';

import 'moment/locale/en-gb';

const locale = 'en-GB';

moment.locale(locale);

export interface DateOnly {
  year: number;
  month: number;
  day: number;
}

export interface Time {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

export interface DateTime {
  date: DateOnly;
  time: Time;
}

export function fromJsDate(jsDate: Date): DateTime {
  return {
    date: {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1,
      day: jsDate.getDate(),
    },
    time: {
      hour: jsDate.getHours(),
      minute: jsDate.getMinutes(),
      second: jsDate.getSeconds(),
      millisecond: jsDate.getMilliseconds(),
    },
  };
}

export function fromDateTimeUtcString(dateTimeUtcString: DateTimeUtcString) {
  if (!isDateTimeUtcString(dateTimeUtcString)) throw new Error(`Invalid DateTimeUtcString "${dateTimeUtcString}"`);

  const m = moment.utc(dateTimeUtcString)

  return fromMoment(m);
}

export function fromMoment(m: Moment) {
  m = m.clone().utc();

  return {
    date: {
      year: m.year(),
      month: m.month() + 1,
      day: m.date(),
    },
    time: {
      hour: m.hour(),
      minute: m.minute(),
      second: m.second(),
      millisecond: m.millisecond(),
    },
  };
}

export function toMoment(dateTime: DateTime) {
  const { date: { month } } = dateTime;

  return moment.utc({ ...dateTime.date, month: (month - 1), ...dateTime.time });
}

export function formatLocaleDateTime(dateTime: DateTime) {
  return toMoment(dateTime).local().format('DD-MMM-YYYY HH:mm');
}

export function formatLocaleTime(dateTime: DateTime) {
  return toMoment(dateTime).local().format('HH:mm');
}

export function now(): DateTime {
  return fromJsDate(new Date());
}

/**
 * @description Example format: 2017-10-11 07:41:59.213
 */
export type DateTimeUtcString = string;

export function isDateTimeUtcString(str: any): str is DateTimeUtcString {
  if (typeof str !== 'string') return false;

  const dateTimeRegex = /^[1-2][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9].?[0-9]{0,3}$/;

  return dateTimeRegex.test(str);
}

/**
 * @description Example format: 2017-10-11
 */
export type DateString = string;

export function isDateString(str: any): str is DateString {
  if (typeof str !== 'string') return false;

  const dateRegex = /^2[0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]$/;

  return dateRegex.test(str);
}

export function toDateString(dateTimeString: string | Moment) {
  return moment(dateTimeString).format('YYYY-MM-DD');
}

/**
 * @deprecated Use toDateTimeUtcString
 */
export function jsDateToDateTimeUtcString(date: Date | string) {
  if (typeof date === 'string') date = new Date(date);

  const y = String(date.getUTCFullYear()).padStart(4, '0');
  const M = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(2, '0');

  return `${y}-${M}-${d} ${h}:${m}:${s}.${ms}`;
}

export function toDateTimeUtcString(dateTime: DateTime) {
  const { year, month, day } = dateTime.date;
  const { hour, minute, second, millisecond } = dateTime.time;

  const y = String(year).padStart(4, '0');
  const M = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  const h = String(hour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');
  const s = String(second).padStart(2, '0');
  const ms = String(millisecond).padStart(2, '0');

  return `${y}-${M}-${d} ${h}:${m}:${s}.${ms}`;
}

export function toDate(dateString: DateString, end?: boolean) {
  if (dateString.length !== 10) throw new Error(`Invalid DateString "${dateString}"`);

  const date = new Date(dateString);

  date.setHours(0);
  date.setDate(parseInt(dateString.split('-')[2], 10));

  if (end) {
    date.setHours(23);
    date.setMinutes(59);
  }

  return date;
}

/**
 * Return date like: 16-Oct-2017
 * @param dateTimeString Example format: 2017-10-11
 */
export function formatDateOnly(dateTimeString: DateString | Moment) {
  if (typeof dateTimeString === 'string' && !isDateString(dateTimeString)) throw new Error(`Not a valid DateString: ${dateTimeString}`);

  return moment.utc(dateTimeString).format('DD-MMM-YYYY');
}

export function formatDateOnlyWithDow(dateTimeString: DateString | Moment) {
  if (typeof dateTimeString === 'string' && !isDateString(dateTimeString)) throw new Error(`Not a valid DateString: ${dateTimeString}`);

  return moment.utc(dateTimeString).format('ddd DD-MMM-YYYY');
}

export function getDayOfWeekFromDate(dateTimeString: DateString | Moment) {
  if (typeof dateTimeString === 'string' && !isDateString(dateTimeString)) throw new Error(`Not a valid DateString: ${dateTimeString}`);

  return moment.utc(dateTimeString).format('ddd');
}

/**
 * Return date like: 16-Oct-2017 15:04:53
 * @param dateTimeString Example format: 2017-10-11 07:41:59.213+01
 */
export function formatDate(dateTimeString: DateTimeUtcString | Moment) {
  return moment.utc(dateTimeString).format('DD-MMM-YYYY HH:mm');
}
