import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (theme: Theme) => ({
  container: {},

  pane: {},

  selectField: {},

  textField: {
    width: '100%',
  },
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
