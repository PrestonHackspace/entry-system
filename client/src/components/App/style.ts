import { CSSProperties } from 'react';
import { Theme } from 'material-ui';
import returnof from 'returnof';

export const Styles = (_theme: Theme) => ({
  app: {
    background: '#ccc',
    height: '100vh',
  } as CSSProperties,
});

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
