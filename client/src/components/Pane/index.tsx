import * as React from 'react';
import { withStyles, WithStyles, Paper } from 'material-ui';
import * as classNames from 'classnames';
import { Styles, ClassNames } from './style';

interface Props {
  className?: string;
  title?: string;
  titleCentred?: boolean;
  marginBottom?: boolean;
  noPadding?: boolean;
  paneHidden?: boolean;
  onTitleClick?: () => void;
  children: React.ReactNode;
}

export const Pane = withStyles(Styles)(
  ({ classes, className, title, titleCentred, marginBottom, noPadding, paneHidden, onTitleClick, children }: Props & WithStyles<ClassNames>) => {
    return (
      <Paper className={classNames(classes.paper, className, marginBottom && classes.paperWithMargin)}>
        {title ?
          <div className={classes.header} onClick={onTitleClick} style={onTitleClick ? { cursor: 'pointer' } : {}}>
            <h3 className={classNames(classes.heading, titleCentred && classes.headingCentred)}>{title}</h3>
          </div>
          : null}
        {!paneHidden ?
          <div className={noPadding ? classes.paperInnerWithNoPadding : classes.paperInner}>
            {children}
          </div> : null}
      </Paper>
    );
  },
);
