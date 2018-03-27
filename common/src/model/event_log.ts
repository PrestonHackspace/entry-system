import { UUID } from "../lib";
import { DateTimeUtcString } from "../lib/date";

export type EventLogStatus = 'Pending' | 'Sent' | 'Failed';

export interface EventLog {
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
}
