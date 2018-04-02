import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (_theme: Theme) => ({
  link: {
    color: 'inherit',
    textDecoration: 'inherit',
    fontWeight: 'inherit',
  } as React.CSSProperties,
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
