import * as React from 'react';
import { Grid, TextField, withStyles, WithStyles } from 'material-ui';
import { FormEvent } from 'react';
import { mutate } from '../../common/lib';
import { ButtonLink } from '../ButtonLink';
import { Styles, ClassNames } from './style';

export interface Login {
  email: string;
  password: string;
}

interface Props {
  login: Partial<Login>;

  onChange: (login: Partial<Login>) => void;
  onSubmit: (login: Login) => void;
  onResetPassword: (email?: string) => void;
}

export const LoginForm = withStyles(Styles)(
  ({ classes, login, onChange, onResetPassword, onSubmit }: Props & WithStyles<ClassNames>) => {

    const handleChange = (propName: keyof Login) => (event: React.FormEvent<any>) => {
      const value = (event.target as any).value;

      onChange(mutate(login, (mutable) => {
        mutable[propName] = value;
      }));
    };

    function submit(e: FormEvent<any>) {
      e.preventDefault();

      const { email, password } = login;

      if (email && password) {
        onSubmit({ email, password });
      } else {
        alert('Please complete both login fields');
      }
    }

    return (
      <form noValidate autoComplete='off' className={classes.container} onSubmit={submit}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              id='email'
              label='Email'
              className={classes.textField}
              margin='normal'
              onChange={handleChange('email')} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id='password'
              label='Password'
              type='password'
              className={classes.textField}
              margin='normal'
              onChange={handleChange('password')} />
          </Grid>
        </Grid>

        <div className={classes.buttonBar}>
          <ButtonLink type='submit' colour='primary'>Sign in</ButtonLink>
          <ButtonLink type='button' onClick={() => onResetPassword(login.email)}>Reset Password</ButtonLink>
        </div>
      </form>
    );
  },
);
