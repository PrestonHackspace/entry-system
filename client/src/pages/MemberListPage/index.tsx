import * as React from 'react';
import { DataTable, DataTableColumn } from '../../components/DataTable';
import { CommonProps, ButtonInfo } from '../../types';
import { IconLink } from '../../components/IconLink';
import { MemberApi } from '../../common/api';
import { formatDate } from '../../common/lib/date';
import { Member } from '../../common/model/member';
import { AdminLayout } from '../../components/AdminLayout';
import { Pane } from '../../components/Pane';
import { isRole, RoleEnum } from '../../common/model/user';

interface Props extends CommonProps {
  getAllMembers: MemberApi['getAll'];
}

export const MemberListPage: React.ComponentType<Props> = (props: Props) => {
  const { app, getAllMembers } = props;

  const columns: DataTableColumn<Member>[] = [
    { name: 'created_at', title: 'Created', text: (row) => formatDate(row.created_at) },
    { name: 'updated_at', title: 'Updated', text: (row) => formatDate(row.updated_at) },
    { name: 'name', title: 'Name' },
    { name: 'email', title: 'Email' },
    { name: 'code', title: 'Code' },
    {
      name: 'edit',
      title: 'Amend',
      cell: (row) => (<IconLink type='edit' tooltip='Edit' to={'/members/' + row.id} shrinkWrap={true}>Edit</IconLink>),
      text: (row) => `${app.bootstrap.baseUrl}/members/${row.id}`,
    },
  ];

  function fetch(take: number, skip: number) {
    return getAllMembers({}, { take, skip });
  }

  const canNew = isRole(app.role, RoleEnum.Admin);

  const buttons: (ButtonInfo | null)[] = [
    canNew ? { iconKey: 'add', label: 'Add Member', to: '/members/new' } : null,
  ];

  return (
    <AdminLayout title='Home Page' toolbarButtons={buttons} app={app}>
      <Pane title='Members' noPadding={true}>
        <DataTable
          columns={columns as DataTableColumn<{ id: string }>[]}
          fetch={fetch} />
      </Pane>
    </AdminLayout>
  );
};
