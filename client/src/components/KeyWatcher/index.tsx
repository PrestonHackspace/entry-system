import * as React from 'react';

interface Props {
  onLine(line: string): void;
}

interface State {
  line: string;
}

export class KeyWatcher extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      line: '',
    };
  }

  componentWillMount() {
    window.document.body.addEventListener('keydown', (e) => this.keyDownHandler(e));
  }

  componentWillUnmount() {
    window.document.body.removeEventListener('keydown', (e) => this.keyDownHandler(e));
  }

  keyDownHandler(e: KeyboardEvent) {
    const { line } = this.state;

    if (e.keyCode >= 48 && e.keyCode <= 57) {
      this.setState({ line: line + String.fromCharCode(e.keyCode) });
    }

    if (e.keyCode === 13 && line.length > 0) {
      this.props.onLine(line);
      this.setState({ line: '' });
    }
  }

  render() {
    return null;

    // return (<div>{this.state.line}</div>);
  }
}
