import * as React from 'react';
import { DataTable, DataTableColumn } from '../../components/DataTable';
import { CommonProps, ButtonInfo } from '../../types';
import { IconLink } from '../../components/IconLink';
import { UserApi } from '../../common/api';
import { User, isRole, RoleEnum } from '../../common/model/user';
import { AdminLayout } from '../../components/AdminLayout';
import { Pane } from '../../components/Pane';
import { formatDate } from '../../common/lib/date';

interface Props extends CommonProps {
  getAllUsers: UserApi['getAll'];
}

export const UserListPage: React.ComponentType<Props> = (props: Props) => {
  const { app, getAllUsers } = props;

  const columns: DataTableColumn<User>[] = [
    { name: 'created_at', title: 'Created', text: (row) => formatDate(row.created_at) },
    { name: 'updated_at', title: 'Updated', text: (row) => formatDate(row.updated_at) },
    { name: 'role', title: 'Role', text: (row) => row.role },
    { name: 'name', title: 'Name' },
    { name: 'email', title: 'Email' },
    {
      name: 'edit',
      title: 'Amend',
      cell: (row) => (<IconLink type='edit' tooltip='Edit' to={'/users/' + row.id} shrinkWrap={true}>Edit</IconLink>),
      text: (row) => `${app.bootstrap.baseUrl}/users/${row.id}`,
    },
  ];

  function fetch(take: number, skip: number) {
    return getAllUsers({}, { take, skip });
  }

  const canNew = isRole(app.role, RoleEnum.Admin);

  const buttons: (ButtonInfo | null)[] = [
    canNew ? { iconKey: 'add', label: 'Add User', to: '/users/new' } : null,
  ];

  return (
    <AdminLayout title='Home Page' toolbarButtons={buttons} app={app}>
      <Pane title='Users' noPadding={true}>
        <DataTable
          columns={columns as DataTableColumn<{ id: string }>[]}
          fetch={fetch} />
      </Pane>
    </AdminLayout>
  );
};
