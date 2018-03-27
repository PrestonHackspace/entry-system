import * as React from 'react';
import { withStyles, Dialog, DialogTitle, WithStyles, Typography, DialogActions } from 'material-ui';
import { ButtonLink } from '../ButtonLink';
import { Styles, ClassNames } from './style';

export interface ButtonDialogButton {
  label: string;
}

export interface ButtonDialogContent {
  title: string;
  message: string;

  buttons: ReadonlyArray<ButtonDialogButton>;

  onButtonClick: (button: ButtonDialogButton) => void;
  onRequestClose: () => void;
}

interface Props {
  content: ButtonDialogContent | null;
}

export const ButtonDialog = withStyles(Styles)(
  ({ classes, content, ...other }: Props & WithStyles<ClassNames>) => {

    const onRequestClose = (e: React.SyntheticEvent<{}>) => {
      if (!content) return console.warn('Attempt to close null alert');

      content.onRequestClose();
    };

    const onClick = async (e: React.SyntheticEvent<{}>, button: ButtonDialogButton) => {
      if (!content) return console.warn('Attempt to action a null alert');

      content.onButtonClick(button);
    };

    return (
      <Dialog open={!!content} onClose={onRequestClose} {...other}>
        <DialogTitle>{content ? content.title : ''}</DialogTitle>
        <div className={classes.message}>
          <Typography dangerouslySetInnerHTML={{ __html: content ? content.message : '' }} />
        </div>
        <DialogActions>
          {
            content && content.buttons.map((button, index) => (
              <ButtonLink key={index} onClick={(e) => onClick(e, button)}>
                {button.label}
              </ButtonLink>
            ))
          }
        </DialogActions>
      </Dialog>
    );

  },
);
