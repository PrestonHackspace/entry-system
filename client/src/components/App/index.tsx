import * as React from 'react';
import { WithStyles, withStyles, createMuiTheme, MuiThemeProvider } from 'material-ui';
import { Styles, ClassNames } from './style';
import { BrowserRouter, RouteComponentProps, Route } from 'react-router-dom';
import { Bootstrap } from '../../common/model/config';
import { ApiHub, getApis } from '../../api';
import { Session, Role } from '../../common/model/user';
import { Alert, Prompt, PromptButton, CommonProps } from '../../types';
import { getRouteDefinitions, RouteParams } from '../../routes';
import { History } from 'history';
import { pick } from '../../common/lib';
import { ButtonDialogContent, ButtonDialogButton, ButtonDialog } from '../ButtonDialog';
import matchPath from '../../lib/path';
import { LoginPage } from '../../pages/LoginPage';
import { KeyWatcher } from '../KeyWatcher';

const theme = createMuiTheme({ palette: { type: 'light' as 'light' } });

interface Props {
  bootstrap: Bootstrap;
  apiHub: ApiHub;
}

interface State {
  session: Session | null;
  dialogContent: ButtonDialogContent | null;
  drawerOpen: boolean;
  dirty: boolean;

  onLine: ((line: string) => void) | null;
}

export const App = withStyles(Styles)(
  class App extends React.PureComponent<Props & WithStyles<ClassNames>, State> {
    constructor(props: Props & WithStyles<ClassNames>) {
      super(props);

      this.state = {
        session: null,
        dialogContent: null,
        drawerOpen: false,
        dirty: false,

        onLine: null,
      };
    }

    setSession(session: Session | null) {
      this.setState({ session });
    }

    async openAlert(alert: Alert) {
      await this.openPrompt({
        ...pick(alert, 'title', 'message'),
        onClose: () => { },
        buttons: [
          {
            label: 'Dismiss',
            onClick: () => { },
          },
        ],
      });
    }

    async openPrompt(prompt: Prompt) {
      try {
        const button = await new Promise<PromptButton | null>((resolve) => {
          const dialogContent: ButtonDialogContent = {
            ...pick(prompt, 'title', 'message', 'buttons'),

            onButtonClick: (button: ButtonDialogButton) => resolve(button as PromptButton),

            onRequestClose: () => resolve(null),
          };

          this.setState({ dialogContent });
        });

        if (button) {
          const promise = button.onClick(button);

          if (promise) await promise;

          this.setState({ dialogContent: null });
        } else {
          if (prompt.onClose) {
            const promise = prompt.onClose();

            if (promise) await promise;

            this.setState({ dialogContent: null });
          }
        }
      } catch (err) {
        console.error('Error in dialog event', err);
        this.setState({ dialogContent: null });
        throw err;
      }
    }

    setDirty(dirty: boolean) {
      this.setState({ dirty });
    }

    async assertDirty() {
      if (this.state.dirty) {
        await this.openPrompt({
          title: 'Unsaved changes',
          message: 'You have made unsaved changes. Are you sure you wish to continue?',
          onClose: async () => {
            return Promise.reject(new Error('Abort navigate'));
          },
          buttons: [
            {
              label: 'No',
              onClick: async () => {
                return Promise.reject(new Error('Abort navigate'));
              },
            },
            {
              label: 'Yes',
              onClick: async () => {
                this.setDirty(false);
              },
            },
          ],
        });
      }
    }

    onToggleDraw(state?: boolean) {
      this.setState({ drawerOpen: typeof state === 'undefined' ? !this.state.drawerOpen : state });
    }

    getSessionToken() {
      return this.state.session ? this.state.session.sessionToken : null;
    }

    getCommonProps(history: History): CommonProps {
      const { bootstrap } = this.props;
      const { session, dirty } = this.state;

      const authenticatedUser = session ? session.user : null;

      const role: Role = authenticatedUser ? authenticatedUser.role : 'Anon';

      return {
        app: {
          bootstrap,
          authenticatedUser,
          session,
          role,
          drawerOpen: this.state.drawerOpen,
          dirty,
          history,

          setSession: (session) => this.setSession(session),
          openAlert: (alert) => this.openAlert(alert),
          openPrompt: (prompt) => this.openPrompt(prompt),
          setDirty: (dirty) => this.setDirty(dirty),
          assertDirty: () => this.assertDirty(),

          onToggleDraw: (state?) => this.onToggleDraw(state),

          onLine: (handler) => this.onLine(handler),
        },
      };
    }

    getComponent({ history, location }: RouteComponentProps<RouteParams>) {
      const sessionToken = this.getSessionToken();

      const apis = getApis(this.props.apiHub, sessionToken);
      const commonProps = this.getCommonProps(history);
      const routes = getRouteDefinitions(apis, commonProps);

      const route = routes.map((route) => ({
        route,
        match: matchPath(location.pathname, pick(route, 'path', 'exact')),
      })).find((route) => route.match !== null);

      if (!route || !route.match) return 'Not found';

      const { element, roles } = route.route;

      const reason = this.checkRole(roles);

      if (reason) {
        return <LoginPage
          {...commonProps}
          login={apis.userApi.login}
          sendResetPasswordEmail={apis.userApi.sendResetPasswordEmail}
          location={location}
          reason={reason}
          onLogin={(session) => this.setSession(session)} />;
      }

      return element instanceof Function ? element(route.match.params) : element;
    }

    checkRole(roles: Role[]): string | null {
      const userRole = this.state.session && this.state.session.user.role || 'Anon';
      const canAccess = roles.indexOf('Anon') !== -1 || roles.indexOf(userRole) !== -1;

      if (!canAccess) {
        return `Role of "${roles.join(' or ')}" required to access this page. You are currently "${userRole}"`;
      }

      return null;
    }

    onLine(handler: (line: string) => void) {
      if (this.state.onLine === handler) return;

      this.setState({ onLine: handler });
    }

    handleLine(line: string) {
      if (this.state.onLine) this.state.onLine(line);
    }

    render() {
      const { classes } = this.props;

      return (
        <MuiThemeProvider theme={theme}>
          <KeyWatcher onLine={(line) => this.handleLine(line)} />

          <BrowserRouter>
            <div className={classes.app}>
              <ButtonDialog content={this.state.dialogContent} />

              <Route render={(props) => this.getComponent(props)} />
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      );
    }
  },
);
