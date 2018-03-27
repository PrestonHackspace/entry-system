import { EventLog } from './model/event_log';
import { Member, PartialMemberDetailed, MemberDetailed } from './model/member';
import { User, PartialUser, Session } from './model/user';
import { UUID } from './lib';
import { ConfigKey, Config, Bootstrap } from './model/config';
import { EntryList, SignInOutResponse } from './model/entry_log';

export interface Paging {
  take: number;
  skip: number;
}

export interface ConfigApi {
  bootstrap(): Promise<Bootstrap>;
  getValues(): Promise<Config>;
  setValue<TKey extends ConfigKey, TValue extends Config[TKey]>(key: TKey, value: TValue): Promise<void>;
}

export interface EventLogApi {
  getAll(query: {}, paging: Paging): Promise<{ items: EventLog[], totalCount: number }>;
  getOne(id: UUID): Promise<EventLog>;
}

export interface UserApi {
  getAll(query: {}, paging: Paging): Promise<{ items: User[], totalCount: number }>;
  getOne(id: UUID): Promise<User>;
  save(userPartial: PartialUser): Promise<User>;
  delete(id: UUID): Promise<void>;

  verify(userId: UUID, token: string): Promise<{ user: User, readyToLogin: boolean }>;
  login(email: string, password: string): Promise<Session>;
  sendResetPasswordEmail(email: string): Promise<void>;
  resetPassword(userId: UUID, token: string, newPassword: string): Promise<User>;
}

export interface MemberApi {
  getAll(query: {}, paging?: Paging): Promise<{ items: Member[], totalCount: number }>;
  getNew(): Promise<PartialMemberDetailed>;
  getOne(id: UUID): Promise<MemberDetailed>;
  save(memberPartial: PartialMemberDetailed): Promise<MemberDetailed>;
  delete(id: UUID): Promise<void>;
}

export interface EntryLogApi {
  getDayView(): Promise<EntryList>;
  toggle(code: string): Promise<SignInOutResponse>;
  signInWithNewMember(code: string, name: string): Promise<SignInOutResponse>;
}
