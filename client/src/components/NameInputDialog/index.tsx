import * as React from 'react';
import { FormEvent, ChangeEvent } from 'react';
import { withStyles, WithStyles } from 'material-ui';
import { Styles, ClassNames } from './style';

interface Props {
  title: string;
  buttonText: string;

  onChange(input: string): void;
  onCancel(): void;
  onSubmit(): void;
}

export const NameInputDialog = withStyles(Styles)(
  ({ classes, title, buttonText, onChange, onCancel, onSubmit }: Props & WithStyles<ClassNames>) => {

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.keyCode === 27) {
        onCancel();
      }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      onChange(e.target.value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
      onSubmit();

      e.preventDefault();
    }

    return (
      <div className={classes.dialog}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <label className={classes.title}>{title}</label>
          <input className={classes.input} type='text' onKeyDown={handleKeyDown} onChange={handleChange} ref={(input) => input && input.focus()} />
          <button className={classes.button} type='submit'>{buttonText}</button>
        </form>
      </div>
    );

  },
);
