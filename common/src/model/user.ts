import * as _ from 'lodash';
import { UUID, strEnum, RegEx, Validator } from '../lib';
import { DateTimeUtcString } from '../lib/date';

export const AnonId = '00000000-0000-0000-0000-000000000000';

export type Role = 'Anon' | 'Admin' | 'Viewer';

export interface RoleGroup {
  Registered: Role[];
}

export const Roles: Role[] = ['Anon', 'Admin', 'Viewer',];

export const RoleEnum = strEnum(Roles);

export function toRole(role: string): Role {
  if (Roles.indexOf(role as Role) === -1) throw new Error();

  return role as Role;
}

export const RoleGroups: RoleGroup = {
  Registered: [RoleEnum['Admin'], RoleEnum['Viewer']],
};

export function isRole(roleToTest: Role, ...roleList: ((Role | Role[])[])) {
  const roles = _.flatten(roleList);

  return roles.indexOf(roleToTest) !== -1;
}

export interface UserLite {
  readonly id: UUID;
  readonly name: string;
}

export interface User {
  readonly id: UUID;
  readonly role: Role;
  readonly name: string;
  readonly email: string;
  readonly flags: UserFlags;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;
}

export interface PartialUser {
  readonly id?: UUID;
  role?: Role;
  name?: string;
  email?: string;
  newPassword?: string;
  readonly flags: UserFlags;

  readonly created_at?: DateTimeUtcString;
  readonly updated_at?: DateTimeUtcString;
}

export interface UserFlags {
  readonly email_verification_token?: string;
  readonly email_verified?: boolean;
}

export interface Session {
  user: User;
  sessionToken: string;
}

export interface UserLink {
  readonly id: UUID;
  readonly name: string;
  linked: boolean;
}

export const UserValidator: Validator<PartialUser> = {
  email: [(val?: string) => val && !RegEx.Email.test(val) ? 'Please enter a valid email address.' : undefined],
};
