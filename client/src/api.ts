import { ConfigApi, UserApi, MemberApi, EventLogApi, EntryLogApi } from './common/api';
import { ApiClient } from './lib/api-client';

export interface ApiHub {
  configApi: (sessionToken: string | null) => ConfigApi;
  eventLogApi: (sessionToken: string | null) => EventLogApi;
  userApi: (sessionToken: string | null) => UserApi;
  memberApi: (sessionToken: string | null) => MemberApi;
  entryLogApi: (sessionToken: string | null) => EntryLogApi;
}

export async function NewApiHub(): Promise<ApiHub> {
  const apiClient = ApiClient();

  return {
    configApi: await apiClient.getApi<ConfigApi>('ConfigApi'),
    eventLogApi: await apiClient.getApi<EventLogApi>('EventLogApi'),
    userApi: await apiClient.getApi<UserApi>('UserApi'),
    memberApi: await apiClient.getApi<MemberApi>('MemberApi'),
    entryLogApi: await apiClient.getApi<EntryLogApi>('EntryLogApi'),
  };
}

export function getApis(apiHub: ApiHub, sessionToken: string | null): Apis {
  return {
    configApi: apiHub.configApi(sessionToken),
    eventLogApi: apiHub.eventLogApi(sessionToken),
    userApi: apiHub.userApi(sessionToken),
    memberApi: apiHub.memberApi(sessionToken),
    entryLogApi: apiHub.entryLogApi(sessionToken),
  };
}

export interface Apis {
  configApi: ConfigApi;
  eventLogApi: EventLogApi;
  userApi: UserApi;
  memberApi: MemberApi;
  entryLogApi: EntryLogApi;
}
