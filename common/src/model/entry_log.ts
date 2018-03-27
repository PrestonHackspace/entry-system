import { UUID } from '../lib';
import { Member } from './member';
import { DateTime } from '../lib/date';

export type EntryType = 'SignIn' | 'SignOut';

// export interface MemberCurrentView {
//   readonly id: UUID;

//   readonly status: MemberStatus;
//   readonly email: string;
//   readonly name: string;
//   readonly code: string;

//   readonly created_at: DateTimeUtcString;
//   readonly updated_at: DateTimeUtcString;

//   readonly created_by: UUID;
//   readonly updated_by: UUID;

//   readonly deleted: boolean;

//   readonly sign_in_time: DateTimeUtcString | null;
//   readonly sign_out_time: DateTimeUtcString | null;
// }

export interface EntryList {
  entries: Entry[];
}

export interface Entry {
  member_id: UUID;
  name: string;
  signInTime: DateTime | null;
  signOutTime: DateTime | null;
}

export interface SignInOutResponse {
  type: 'MemberNotFound' | 'SignIn' | 'SignOut';
  member?: Member;
  entryList?: EntryList;
}
