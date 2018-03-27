import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (theme: Theme) => ({
  container: {},

  textField: {
    width: '100%',
  },

  buttonBar: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row-reverse',
    '& > *': {
      marginLeft: 8,
    },
  } as React.CSSProperties,
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
