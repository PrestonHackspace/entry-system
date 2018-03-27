import { UUID, Validator, RegEx } from "../lib";
import { DateTimeUtcString } from "../lib/date";

export type MemberStatus = 'Approved';

export interface Member {
  readonly id: UUID;
  readonly status: MemberStatus;
  readonly email: string;
  readonly name: string;
  readonly code: string;

  readonly created_at: DateTimeUtcString;
  readonly updated_at: DateTimeUtcString;
}

export interface MemberDetailed extends Member {

}

export interface PartialMember {
  readonly id?: UUID;
  readonly status?: MemberStatus;
  email?: string;
  name?: string;
  code?: string;

  readonly created_at?: DateTimeUtcString;
  readonly updated_at?: DateTimeUtcString;
}

export interface PartialMemberDetailed extends PartialMember {

}

export const MemberValidator: Validator<PartialMember> = {
  name: [
    (val?: string) => !val ? 'Please enter a name' : undefined,
  ],
  email: [
    (val?: string) => !val ? 'Please enter an email address' : undefined,
    (val?: string) => val && !RegEx.Email.test(val) ? 'Please enter a valid email address.' : undefined
  ],
};
