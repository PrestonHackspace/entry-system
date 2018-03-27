import * as React from 'react';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import HomeIcon from 'material-ui-icons/Home';
// import SettingsIcon from 'material-ui-icons/Settings';
// import LinearScaleIcon from 'material-ui-icons/LinearScale';
// import EventNoteIcon from 'material-ui-icons/EventNote';
import StoreIcon from 'material-ui-icons/Store';
import BookIcon from 'material-ui-icons/Book';
// import DescriptionIcon from 'material-ui-icons/Description';
// import DateRangeIcon from 'material-ui-icons/DateRange';
import { Role } from './common/model/user';

export interface LinkDefinition {
  title: string;
  path: string;
  icon: JSX.Element;
  roles: Role[];
}

export const Links: ReadonlyArray<Readonly<LinkDefinition>> = [
  {
    title: 'Home',
    path: '/',
    icon: <HomeIcon />,
    roles: ['Anon', 'Admin'],
  }, {
    title: 'Entry',
    path: '/entry',
    icon: <StoreIcon />,
    roles: ['Anon', 'Admin', 'Viewer'],
  }, {
    title: 'Users',
    path: '/users',
    icon: <AccountCircleIcon />,
    roles: ['Admin'],
  }, {
    title: 'Members',
    path: '/members',
    icon: <BookIcon />,
    roles: ['Admin'],
  },
];
