import { Theme, StyleRulesCallback } from 'material-ui';
import { StyleRules } from 'material-ui/styles';

export const Styles: Style = (_theme: Theme) => ({
  dialog: {
    position: 'fixed',
    left: '20vw',
    top: '20vh',
    right: '20vw',
    bottom: '20vh',
    border: 'solid 2px #000',
    background: '#77f',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1vw',

    '& > *': {
      flex: 1,
      fontSize: '5vh',
    },
  },

  title: {
    textAlign: 'center',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
  },

  input: {
    border: 'solid 2px #000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1vh',
  },

  button: {
    textAlign: 'center',
    marginTop: '1vw',
  },
});

export type ClassNames = 'dialog' | 'form' | 'title' | 'input' | 'button';

type Style = StyleRules<ClassNames> | StyleRulesCallback<ClassNames>;
