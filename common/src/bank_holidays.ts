import { isDateString } from './lib';

export const BankHolidays = [
  {
    'title': 'New Year’s Day',
    'date': '2017-01-02',
    'notes': 'Substitute day',
    'bunting': true,
  },
  {
    'title': 'St Patrick’s Day',
    'date': '2017-03-17',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Good Friday',
    'date': '2017-04-14',
    'notes': '',
    'bunting': false,
  },
  {
    'title': 'Easter Monday',
    'date': '2017-04-17',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Early May bank holiday',
    'date': '2017-05-01',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Spring bank holiday',
    'date': '2017-05-29',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Battle of the Boyne (Orangemen’s Day)',
    'date': '2017-07-12',
    'notes': '',
    'bunting': false,
  },
  {
    'title': 'Summer bank holiday',
    'date': '2017-08-28',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Christmas Day',
    'date': '2017-12-25',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Boxing Day',
    'date': '2017-12-26',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'New Year’s Day',
    'date': '2018-01-01',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'St Patrick’s Day',
    'date': '2018-03-19',
    'notes': 'Substitute day',
    'bunting': true,
  },
  {
    'title': 'Good Friday',
    'date': '2018-03-30',
    'notes': '',
    'bunting': false,
  },
  {
    'title': 'Easter Monday',
    'date': '2018-04-02',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Early May bank holiday',
    'date': '2018-05-07',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Spring bank holiday',
    'date': '2018-05-28',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Battle of the Boyne (Orangemen’s Day)',
    'date': '2018-07-12',
    'notes': '',
    'bunting': false,
  },
  {
    'title': 'Summer bank holiday',
    'date': '2018-08-27',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Christmas Day',
    'date': '2018-12-25',
    'notes': '',
    'bunting': true,
  },
  {
    'title': 'Boxing Day',
    'date': '2018-12-26',
    'notes': '',
    'bunting': true,
  },
];

export function isBankHoliday(date: string) {
  if (!isDateString(date)) throw new Error('Not a date!');

  return BankHolidays.filter((holiday) => {
    return holiday.date === date;
  }).length > 0;
}
