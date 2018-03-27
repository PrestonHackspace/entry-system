import { CSSProperties } from 'react';

export const Styles = {
  SoundList: {

  } as CSSProperties,

  List: {
    padding: 16,
    margin: 0,
  } as CSSProperties,

  Item: {
    listStyle: 'none',
    marginBottom: 16,

    '&:last-child': {
      marginBottom: 0,
    },
  } as CSSProperties,
};

export type ClassNames = keyof typeof Styles;
