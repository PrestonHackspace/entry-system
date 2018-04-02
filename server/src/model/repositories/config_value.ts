import Knex = require('knex');
import uuid = require('uuid');
import { UUID, mutate } from '../../common/lib';
import { ConfigValueRow } from '../tables';
import { ConfigKey, Config, ConfigDummy } from '../../common/model/config';
import { toDateTimeUtcString, now } from '../../common/lib/date';

export function NewConfigValueRepository(knex: Knex, operatingUserId: UUID) {
  return {
    async getValues() {
      const items: ConfigValueRow[] = await knex('config_value')
        .select('*')
        .orderBy('config_value.key');

      let config = ConfigDummy;

      items.forEach((configValue) => {
        const val = JSON.parse(configValue.value);

        if (typeof val !== 'undefined') {
          config = mutate(config, (mutable) => {
            mutable[configValue.key] = val;
          });
        }
      });

      return config;
    },

    async getValue<TKey extends ConfigKey, TValue extends Config[TKey]>(key: TKey): Promise<TValue> {
      const configValues: ConfigValueRow[] = await knex('config_value')
        .where({ key })
        .select('*');

      if (configValues.length === 0) return ConfigDummy[key] as TValue;

      return JSON.parse(configValues[0].value) as TValue;
    },

    async setValue<TKey extends ConfigKey, TValue extends Config[TKey]>(key: TKey, value: TValue) {
      const time = toDateTimeUtcString(now());

      const [countResult] = await knex('config_value')
        .where({ key })
        .count('id')
        .as('count');

      const count = parseInt(countResult['count'], 10);

      if (count === 0) {
        const record: ConfigValueRow = {
          id: uuid.v1(),
          key,
          value: JSON.stringify(value),
          created_at: time,
          updated_at: time,
          created_by: operatingUserId,
          updated_by: operatingUserId,
        };

        await knex('config_value')
          .insert(record);
      } else {
        const record: Partial<ConfigValueRow> = {
          value: JSON.stringify(value),
          updated_at: time,
          updated_by: operatingUserId,
        };

        await knex('config_value')
          .where({ key })
          .update(record);
      }
    },

    async delete(id: UUID) {
      await knex('config_value').where({ id });
    },
  };
}
