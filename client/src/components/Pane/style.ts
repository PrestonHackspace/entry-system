import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (theme: Theme) => ({
  paper: {},

  paperWithMargin: {
    margin: `0 0 ${theme.spacing.unit * 3}px 0`,
  },

  header: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    background: '#2DB5AD',
    borderBottom: `solid 1px ${theme.palette.common.black}`,
    // textAlign: 'center',
  },

  heading: {
    color: '#fff',
    fontSize: '16px',
    textTransform: 'uppercase',
    margin: 0,
  },

  headingCentred: {
    textAlign: 'center',
  },

  paperInnerWithNoPadding: {
    height: 'calc(100% - 50px)',
  },

  paperInner: {
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 98px)',
  },
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
