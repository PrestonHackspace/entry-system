import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (theme: Theme) => ({
  logo: {
    maxWidth: 400,
    margin: `${theme.spacing.unit * 3}px auto`,
    display: 'block',
  },

  loginPane: {
    maxWidth: 400,
    margin: '0 auto',
  },

  notice: {
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  } as React.CSSProperties,

  demoLogins: {
    marginTop: theme.spacing.unit * 3,
  },

  demoLoginButton: {
    margin: '0 16px',
    flexGrow: 1,
  },
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
