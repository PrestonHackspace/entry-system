import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (theme: Theme) => ({
  message: {
    padding: `0 ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
