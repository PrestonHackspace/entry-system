import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import { Button, PropTypes } from 'material-ui';
import { ComponentType, ReactNode } from 'react';
import { clone } from 'lodash';

interface Props {
  children?: ReactNode;
  type?: string;
  to?: string;
  colour?: PropTypes.Color;
  skinny?: boolean;
  className?: string;
  style?: React.CSSProperties;

  onClick?: (e: React.SyntheticEvent<{}>) => Promise<any> | void;
}

export const ButtonLink: ComponentType<Props> = withRouter((props: Props & { history: History }) => {
  const { children, type, to, colour, skinny, className, onClick, history } = props;
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

  if (!style) {
    style = {};
  } else {
    style = clone(style);
  }

  style.backgroundColor = '#2DB5AD';
  style.color = '#fff';

  if (skinny) {
    style.padding = '6px 12px';
    style.minHeight = 32;
    style.minWidth = 'initial';
  }

  return (
    <Button
      variant='raised'
      type={type}
      color={colour}
      className={className}
      style={style}
      onClick={onClickProxy}>
      {children}
    </Button>
  );
});
