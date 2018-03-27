import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { ComponentType } from 'react';
import { withStyles, WithStyles } from 'material-ui';
import * as classNames from 'classnames';
import { Styles, ClassNames } from './style';

interface Props {
  children?: React.ReactNode;
  to?: string;
  className?: string;
  style?: React.CSSProperties;

  onClick?: (e: React.SyntheticEvent<{}>) => Promise<any> | void;
}

export const Link: ComponentType<Props> = withStyles(Styles)(withRouter(((props: Props & WithStyles<ClassNames> & { history: History }) => {
  const { classes, children, to, className, onClick, history } = props;
  let { style } = props;

  async function onClickProxy(e: React.SyntheticEvent<{}>) {
    try {
      if (onClick) {
        const promise = onClick(e);

        if (promise) await promise;
      }

      if (to) {
        history.push(to);
      }
    } catch (err) {
      console.error('onClick', err);
    }
  }

  if (!style) style = {};

  return (
    <a
      className={classNames(classes.link, className)}
      style={style}
      onClick={onClickProxy}
      href='javascript:void(0)'>
      {children}
    </a>
  );
}) as any) as any);
