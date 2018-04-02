import { Theme, StyleRulesCallback } from 'material-ui';
import { StyleRules } from 'material-ui/styles';

export const RowCount = 20;

export const Styles: Style = (_theme: Theme) => ({
  page: {
    background: '#77f',
    height: '100vh',
    padding: '1vh',
  },

  table: {
    background: '#fff',
    height: '100%',
    border: 'solid 2px #000',
    padding: '1vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    // gridTemplateRows: 'repeat(auto-fit, minmax(5%, 1fr))',
    gridTemplateRows: `repeat(${RowCount}, 1fr)`,
    gridGap: '1vh',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: `3fr 1fr 1fr`,
    gridGap: '1vh',
    fontSize: `${(50 / RowCount) | 0}vh`,
  },

  cell: {
    border: 'solid 2px #000',
    height: '100%',
    display: 'grid',
    alignItems: 'center',
    padding: '0 1vh',
    color: '#fff',
  },

  name: {
    // background: '#f77',
    background: 'linear-gradient(to bottom, #f44, #400)',
  },

  signInTime: {
    // background: '#7f7',
    background: 'linear-gradient(to bottom, #4f4, #040)',
    textAlign: 'center',
  },

  signOutTime: {
    // background: '#7f7',
    background: 'linear-gradient(to bottom, #44f, #004)',
    textAlign: 'center',
  },
});

export type ClassNames = 'page' | 'table' | 'row' | 'cell' | 'name' | 'signInTime' | 'signOutTime';

type Style = StyleRules<ClassNames> | StyleRulesCallback<ClassNames>;
