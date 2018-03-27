import * as React from 'react';
import { WithStyles, withStyles } from 'material-ui';
import { LocationDescriptorObject } from 'history';
import { CommonProps } from '../../types';
import { Styles, ClassNames } from './style';
import { UserApi } from '../../common/api';
import { Session } from '../../common/model/user';
import { withState, PropsWithState } from '../../with-state';
import { ButtonLink } from '../../components/ButtonLink';
import { AdminLayout } from '../../components/AdminLayout';
import { Pane } from '../../components/Pane';
import { LoginForm } from '../../components/LoginForm';

interface Props extends CommonProps {
  login: UserApi['login'];
  sendResetPasswordEmail: UserApi['sendResetPasswordEmail'];

  location?: LocationDescriptorObject;
  reason: string;

  onLogin(args: Session | null): void;
}

interface State {
  loginState: Partial<Login>;
}

const defaultState: State = {
  loginState: {},
};

export interface Login {
  email: string;
  password: string;
}

export const LoginPage = withStyles(Styles)(withState<Props & WithStyles<ClassNames>, State>(defaultState,
  (props: PropsWithState<Props & WithStyles<ClassNames>, State>) => {
    console.log('LoginPage');

    const { classes, app, loginState, setState, login, onLogin, sendResetPasswordEmail } = props;

    async function onLoginSubmit(loginState: Login) {
      const { email, password } = loginState;

      try {
        const session = await login(email, password);

        if (onLogin) onLogin(session);

        if (location.pathname === '/login' || location.pathname === '/') {
          app.history.push('/');
        }
      } catch (err) {
        app.openAlert({
          title: 'Login error',
          message: err.message,
        });

        console.error('Login error:', err);
      }
    }

    async function onResetPassword(email?: string) {
      try {
        if (!email) throw new Error('Please enter your email address');

        await sendResetPasswordEmail(email);

        app.openAlert({
          title: 'Email Sent',
          message: 'We have emailed you a link which you will be able to use to reset your password.',
        });
      } catch (err) {
        app.openAlert({
          title: 'Reset password error',
          message: err.message,
        });

        console.error('Login error:', err);
      }
    }

    function getDemoLoginLinks() {
      const demoLoginList = [
        {
          name: 'Admin',
          email: 'es-admin@example.com',
          password: 'password',
        },
      ];

      return demoLoginList.map((l) => (
        <ButtonLink
          className={classes.demoLoginButton}
          key={l.email}
          onClick={() => onLoginSubmit(l)}>
          {l.name}
        </ButtonLink>
      ));
    }

    function onLoginChange(login: Partial<Login>) {
      setState({ loginState: login });
    }

    return (
      <AdminLayout title='Home Page' toolbarButtons={[]} app={app}>
        <Pane title='Login!' className={classes.loginPane}>
          <LoginForm
            login={loginState}
            onChange={(login) => onLoginChange(login)}
            onSubmit={(login) => onLoginSubmit(login)}
            onResetPassword={(email) => onResetPassword(email)} />
        </Pane>

        {
          app.bootstrap.demoMode &&
          <Pane title='Demo logins' className={classes.demoLogins}>
            {getDemoLoginLinks()}
          </Pane>
        }
      </AdminLayout>
    );
  },
));
