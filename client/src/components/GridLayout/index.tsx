import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui';
import { Styles, ClassNames } from './style';

interface Props {
  children: React.ReactNode[];
  minWidth: number;
  gridGap: number;
}

export const GridLayout = withStyles(Styles)(
  (props: Props & WithStyles<ClassNames>) => {
    const { classes, minWidth, gridGap } = props;

    const style: React.CSSProperties = {
      gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
      gridGap: `${gridGap}px`,
    };

    return (
      <div className={classes.grid} style={style}>
        {
          props.children.map((child, index) => (
            <div className={classes.gridItem} key={index}>{child}</div>
          ))
        }
      </div>
    );
  },
);
