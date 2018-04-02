import * as React from 'react';
import { Role } from './common/model/user';
import { Apis } from './api';
import { CommonProps } from './types';
import { UUID } from './common/lib';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { UserEditPage } from './pages/UserEditPage';
import { UserListPage } from './pages/UserListPage';
import { MemberListPage } from './pages/MemberListPage';
import { MemberEditPage } from './pages/MemberEditPage';
import { EntryPage } from './pages/EntryPage';
import { ConfigEdit } from './pages/ConfigEdit';

const UUIDRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export interface RouteInfo {
  path: string;
  exact: boolean;
  element: React.ReactElement<any> | ((params: RouteParams) => JSX.Element);
  roles: Role[];
}

export interface RouteParams {
  id?: string;
}

function getHomePage(_apis: Apis, common: CommonProps) {
  return (
    <HomePage {...common} />
  );
}

function getEntryPage(apis: Apis, common: CommonProps) {
  return (
    <EntryPage
      key='/entry' {...common}
      getDayView={apis.entryLogApi.getDayView}
      toggle={apis.entryLogApi.toggle}
      signInWithNewMember={apis.entryLogApi.signInWithNewMember} />
  );
}

function getLoginPage(apis: Apis, common: CommonProps) {
  const { setSession } = common.app;

  return (
    <LoginPage
      {...common}
      reason=''
      login={apis.userApi.login}
      sendResetPasswordEmail={apis.userApi.sendResetPasswordEmail}
      onLogin={setSession} />
  );
}

function getConfigEditPage(apis: Apis, common: CommonProps) {
  const { setSession } = common.app;

  return (
    <ConfigEdit
      {...common}
      getConfigValues={apis.configApi.getValues}
      setConfigValue={apis.configApi.setValue}
    />
  );
}

function getUserEditPage(apis: Apis, common: CommonProps, id?: UUID) {
  const formRequest = id ? { id } : { init: 'new' as 'new' };

  return (
    <UserEditPage
      {...common}
      getOneUser={apis.userApi.getOne}
      saveUser={apis.userApi.save}
      deleteUser={apis.userApi.delete}
      req={formRequest} />
  );
}

function getMemberEditPage(apis: Apis, common: CommonProps, id?: UUID) {
  const formRequest = id ? { id } : { init: 'new' as 'new' };

  return (
    <MemberEditPage
      {...common}
      getOneMember={apis.memberApi.getOne}
      saveMember={apis.memberApi.save}
      deleteMember={apis.memberApi.delete}
      req={formRequest} />
  );
}

export function getRouteDefinitions(apis: Apis, common: CommonProps) {
  const routes: RouteInfo[] = [
    {
      path: '/',
      exact: true,
      element: getHomePage(apis, common),
      roles: ['Anon'],
    },

    {
      path: '/entry',
      exact: true,
      element: getEntryPage(apis, common),
      roles: ['Admin', 'Viewer'],
    },

    {
      path: '/login',
      exact: true,
      element: getLoginPage(apis, common),
      roles: ['Anon'],
    },

    {
      path: '/config',
      exact: true,
      element: getConfigEditPage(apis, common),
      roles: ['Admin'],
    },

    {
      path: '/users',
      exact: true,
      element: <UserListPage {...common} getAllUsers={apis.userApi.getAll} />,
      roles: ['Admin'],
    },
    {
      path: `/users/:id(${UUIDRegEx})`,
      exact: false,
      element: (params) => getUserEditPage(apis, common, params.id),
      roles: ['Admin'],
    },
    {
      path: '/users/new',
      exact: false,
      element: getUserEditPage(apis, common),
      roles: ['Admin'],
    },

    {
      path: '/members',
      exact: true,
      element: <MemberListPage {...common} getAllMembers={apis.memberApi.getAll} />,
      roles: ['Admin'],
    },
    {
      path: `/members/:id(${UUIDRegEx})`,
      exact: false,
      element: (params) => getMemberEditPage(apis, common, params.id),
      roles: ['Admin'],
    },
    {
      path: '/members/new',
      exact: false,
      element: getMemberEditPage(apis, common),
      roles: ['Admin'],
    },

    {
      path: '/test/:id',
      exact: true,
      element: (params) => <div>{params.id}</div>,
      roles: ['Admin'],
    },
  ];

  return routes;
}
