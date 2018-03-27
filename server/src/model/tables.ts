import { UUID, DateTimeUtcString, JSONString, JSONStringTyped } from '../common/lib';
import { MemberStatus } from '../common/model/member';
import { EntryType } from '../common/model/entry_log';
import { Role, UserFlags } from '../common/model/user';
import { ConfigKey } from '../common/model/config';
import { EventLogStatus } from '../common/model/event_log';

export interface UserRow {
  readonly id: UUID;

  readonly role: Role;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly flags: JSONStringTyped<UserFlags>;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;

  readonly created_by: UUID;
  readonly updated_by: UUID;

  readonly deleted: boolean;
}

export interface ConfigValueRow {
  readonly id: UUID;

  readonly key: ConfigKey;
  readonly value: JSONString;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;

  readonly created_by: UUID;
  readonly updated_by: UUID;
}

export interface EventLogRow {
  readonly id: UUID;

  readonly status: EventLogStatus;
  readonly from: string;
  readonly to: string;
  readonly cc: string | null;
  readonly bcc: string | null;
  readonly subject: string;
  readonly html: string;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;

  readonly created_by: UUID;
  readonly updated_by: UUID;
}

export interface MemberRow {
  readonly id: UUID;

  readonly status: MemberStatus;
  readonly email: string;
  readonly name: string;
  readonly code: string;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;

  readonly created_by: UUID;
  readonly updated_by: UUID;

  readonly deleted: boolean;
}

export interface EntryLogRow {
  readonly id?: UUID;

  readonly member_id: UUID;

  readonly type: EntryType;

  readonly created_at: DateTimeUtcString;
}

export interface MemberCurrentViewRow extends MemberRow {
  sign_in_time: DateTimeUtcString | null;
  sign_out_time: DateTimeUtcString | null;
}
