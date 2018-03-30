import { UUID } from '../lib';
import { Member } from './member';
import { DateTime } from '../lib/date';

export type EntryType = 'SignIn' | 'SignOut';

export interface EntryList {
  entries: Entry[];
}

export interface Entry {
  member_id: UUID;
  name: string;
  signInTime: DateTime | null;
  signOutTime: DateTime | null;
}

export interface SignInResponse {
  type: 'SignIn';
  member: Member;
  entryList: EntryList;
}

export interface SignOutResponse {
  type: 'SignOut';
  member: Member;
  entryList: EntryList;
}

export interface MemberNotFoundResponse {
  type: 'MemberNotFound';
  code: string;
}

export type SignInOutResponse = SignInResponse | SignOutResponse | MemberNotFoundResponse;
