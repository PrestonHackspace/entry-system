import { UserRecord } from '../model/repositories/user';
import { ApiContext } from '../lib/api-server';
import { UUID } from '../common/lib';
import { AppConfig } from '../config/index';

export interface EntrySystemApiContext extends ApiContext {
  authenticatedUser: UserRecord;
}

export function getSubmissionUrl(submission_id: UUID) {
  return `${AppConfig.BaseUrl}/submissions/${submission_id}`;
}
