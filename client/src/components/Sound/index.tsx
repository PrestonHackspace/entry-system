import * as React from 'react';
import { WithStyles, withStyles, Paper, Typography } from 'material-ui';
import { Styles } from './style';
import { IconLink } from '../IconLink';

interface Props {
  sound: number;
}

export const Sound: React.ComponentType<Props> = withStyles(Styles)(
  function SoundList({ classes, sound }: Props & WithStyles<keyof typeof Styles>) {
    function play() {
      console.log('play', sound);
    }

    return (
      <Paper className={classes.Sound}>
        <div className={classes.Thumbnail}>

        </div>

        <div className={classes.Title}>
          <Typography >Sound item {sound}</Typography>
        </div>

        <div className={classes.Controls}>
          <IconLink tooltip='Play' type='play' onClick={play} />
          <IconLink tooltip='Stop' type='stop' />
        </div>
      </Paper>
    );
  },
);
