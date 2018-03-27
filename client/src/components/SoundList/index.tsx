import * as React from 'react';
import { WithStyles, withStyles } from 'material-ui';
import { Styles, ClassNames } from './style';
import { Sound } from '../Sound';

interface Props {
  sounds: number[];
}

export const SoundList: React.ComponentType<Props> = withStyles(Styles)(
  function SoundList({ classes, sounds }: Props & WithStyles<ClassNames>) {
    return (
      <div className={classes.SoundList}>
        <ul className={classes.List}>
          {
            sounds.map((sound, index) => (
              <li className={classes.Item} key={index}>
                <Sound sound={sound} />
              </li>
            ))
          }
        </ul>
      </div>
    );
  },
);
