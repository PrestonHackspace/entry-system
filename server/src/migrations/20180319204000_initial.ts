import * as Knex from 'knex';
import { UserRecord } from '../model/repositories/user';

function toDateTimeTZString(date: Date | string) {
  if (typeof date === 'string') date = new Date(date);

  const y = String(date.getFullYear()).padStart(4, '0');
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(2, '0');
  const o = String(Math.abs(date.getTimezoneOffset() / 60)).padStart(2, '0');

  const plusMinus = date.getTimezoneOffset() <= 0 ? '+' : '-';

  return `${y}-${M}-${d} ${h}:${m}:${s}.${ms}${plusMinus}${o}`;
}

export = {
  async up(knex: Knex) {
    await knex.schema.createTable('user', (table) => {
      table.primary(['id']);

      table.uuid('id');

      table.string('role').notNullable();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.json('flags').notNullable();

      table.specificType('created_at', 'timestamp without time zone').notNullable();
      table.specificType('updated_at', 'timestamp without time zone').notNullable();

      table.uuid('created_by').notNullable();
      table.uuid('updated_by').notNullable();

      table.foreign('created_by').references('id').inTable('user');
      table.foreign('updated_by').references('id').inTable('user');

      table.boolean('deleted').notNullable().defaultTo(false);
    });

    await knex.schema.createTable('config_value', (table) => {
      table.primary(['id']);

      table.uuid('id');

      table.string('key').notNullable().unique();
      table.jsonb('value').notNullable();

      table.specificType('created_at', 'timestamp without time zone').notNullable();
      table.specificType('updated_at', 'timestamp without time zone').notNullable();

      table.uuid('created_by').notNullable();
      table.uuid('updated_by').notNullable();

      table.foreign('created_by').references('id').inTable('user');
      table.foreign('updated_by').references('id').inTable('user');
    });

    await knex.schema.createTable('event_log', (table) => {
      table.primary(['id']);

      table.uuid('id');

      table.string('status').notNullable();
      table.string('from').notNullable();
      table.string('to').notNullable();
      table.string('cc').nullable();
      table.string('bcc').nullable();
      table.string('subject').notNullable();
      table.text('html').notNullable();

      table.specificType('created_at', 'timestamp without time zone').notNullable();
      table.specificType('updated_at', 'timestamp without time zone').notNullable();

      table.uuid('created_by').notNullable();
      table.uuid('updated_by').notNullable();

      table.foreign('created_by').references('id').inTable('user');
      table.foreign('updated_by').references('id').inTable('user');
    });

    await knex.schema.createTable('member', (table) => {
      table.primary(['id']);

      table.uuid('id');

      table.string('status').notNullable();
      table.string('email').notNullable();
      table.string('name').notNullable();
      table.string('code').notNullable().unique();

      table.specificType('created_at', 'timestamp without time zone').notNullable();
      table.specificType('updated_at', 'timestamp without time zone').notNullable();

      table.uuid('created_by').notNullable();
      table.uuid('updated_by').notNullable();

      table.foreign('created_by').references('id').inTable('user');
      table.foreign('updated_by').references('id').inTable('user');

      table.boolean('deleted').notNullable().defaultTo(false);
    });

    await knex.schema.createTable('entry_log', (table) => {
      table.primary(['id']);

      table.uuid('id');

      table.uuid('member_id').notNullable();
      table.foreign('member_id').references('id').inTable('member');

      table.string('type').notNullable();

      table.specificType('created_at', 'timestamp without time zone').notNullable();
    });

    await knex.schema.raw(`

CREATE OR REPLACE VIEW member_current_view AS
  select          m.*,
                  elsi.created_at as "sign_in_time",
                  elso.created_at as "sign_out_time"
  from            "member"    as m

  left outer join "entry_log" as elsi
  on              m.id = elsi.member_id
  and             elsi.type = 'SignIn'
  and             elsi.created_at = (
    select  max(elm.created_at)
    from    "entry_log" as elm
    where   elm.member_id = m.id
    and     elm.type = 'SignIn'
    limit   1
  )

  left outer join "entry_log" as elso
  on              m.id = elso.member_id
  and             elso.type = 'SignOut'
  and             elso.created_at = (
    select  max(elm.created_at)
    from    "entry_log" as elm
    where   elm.member_id = m.id
    limit   1
);;

    `);

    const time = toDateTimeTZString(new Date());

    const id = '00000000-0000-0000-0000-000000000000';

    const userRecord: UserRecord = {
      id,
      role: 'Anon',
      name: 'Anon',
      email: 'anon@example.com',
      password: '',
      created_at: time,
      updated_at: time,
      created_by: id,
      updated_by: id,
      flags: {},
    };

    await knex('user').insert(userRecord);
  },

  async down(knex: Knex) {
    await knex.schema.raw(`DROP VIEW member_current_view;`);

    await knex.schema.dropTableIfExists('entry_log');
    await knex.schema.dropTableIfExists('member');
    await knex.schema.dropTableIfExists('event_log');
    await knex.schema.dropTableIfExists('config_value');
    await knex.schema.dropTableIfExists('user');
  },
};
