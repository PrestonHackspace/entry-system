import { CSSProperties } from 'react';

export const Styles = {
  Sound: {
    display: 'grid',
    gridTemplateColumns: '96px auto',
    gridTemplateRows: '48px 48px',
    gridTemplateAreas: `
      "thumbnail title"
      "thumbnail controls"
    `,
  } as CSSProperties,

  Thumbnail: {
    gridArea: 'thumbnail',
    background: '#ccc',
  } as CSSProperties,

  Title: {
    gridArea: 'title',
    background: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSProperties,

  Controls: {
    gridArea: 'controls',

  } as CSSProperties,
};

export type ClassNames = keyof typeof Styles;
