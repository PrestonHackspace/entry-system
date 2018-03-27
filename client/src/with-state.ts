import React = require('react');
import _ = require('lodash');

type SetState<P, S> = React.Component<P, S>['setState'];

export type PropsWithState<Props, State> = Props & State & { setState: SetState<Props, State> };

interface NestedComponent<P> {
  (props: P & { children?: React.ReactNode }, context?: any): React.ReactElement<any> | null;
}

export function withState<Props, State>(defaultState: State, comp: NestedComponent<PropsWithState<Props, State>>) {
  return class extends React.PureComponent<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = defaultState;
    }

    render() {
      const p = _.merge(
        {},
        this.props,
        this.state,
        {
          setState: (s) => this.setState(s),
        } as { setState: PropsWithState<Props, State>['setState'] },
      );

      return comp(p);
    }
  };
}
