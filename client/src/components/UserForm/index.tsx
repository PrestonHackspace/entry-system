import * as React from 'react';
import { withStyles, Select, MenuItem, Typography, WithStyles } from 'material-ui';
import { PartialUser, Roles, Role } from '../../common/model/user';
import { Pane } from '../Pane';
import { mutate, ValidationPair, getMessages } from '../../common/lib';
import { TextField } from '../TextField';
import { ClassNames, Styles } from './style';
import { GridLayout } from '../GridLayout';

interface Props {
  user: ValidationPair<PartialUser>;
  role: Role;

  onChange(user: PartialUser): void;
}

export const DataForm = withStyles(Styles)(({ classes, user, onChange }: Props & WithStyles<ClassNames>) => {
  const handleChange = (propName: keyof PartialUser) => (event: React.FormEvent<any> | string) => {
    if (propName === 'id') return;
    if (propName === 'flags') return;
    if (propName === 'created_at') return;
    if (propName === 'updated_at') return;

    const value = typeof event === 'string' ? event : (event.target as any).value as string;

    onChange(mutate(user.state, (mutable) => {
      mutable[propName] = value;
    }));
  };

  const rolesItems = Roles
    .filter((role) => role !== 'Anon')
    .map((role) => (<MenuItem key={role} value={role}>{role}</MenuItem>));

  const truth = (value: boolean | undefined) => {
    if (typeof value === 'undefined') {
      return 'n/a';
    }

    return value ? 'Yes' : 'No';
  };

  return (
    <form noValidate autoComplete='off' className={classes.container}>

      <GridLayout minWidth={500} gridGap={24}>

        <Pane title='General' className={classes.pane}>

          <Select
            className={classes.selectField}
            value={user.state.role || ''}
            onChange={handleChange('role')}>
            {rolesItems}
          </Select>

          <TextField
            label='Name'
            className={classes.textField}
            value={user.state.name || ''}
            onChange={handleChange('name')} />

          <TextField
            label='Email'
            className={classes.textField}
            value={user.state.email || ''}
            messages={getMessages(user.validation.email)}
            onChange={handleChange('email')} />

          <TextField
            label='Specify a new password...'
            type='password'
            className={classes.textField}
            value={user.state.newPassword || ''}
            onChange={handleChange('newPassword')} />

        </Pane>

        {
          user.state.flags &&
          <Pane title='Status' className={classes.pane}>
            <Typography>Email verified: <strong>{truth(user.state.flags.email_verified)}</strong></Typography>
            <Typography>Email verification token: <strong>{user.state.flags.email_verification_token}</strong></Typography>
            {/* <Typography>Approved: <strong>{truth(user.flags.approved)}</strong></Typography> */}
          </Pane>
        }

      </GridLayout>

    </form>
  );
});
