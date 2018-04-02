import * as React from 'react';
import { WithStyles, withStyles } from 'material-ui';
import * as classNames from 'classnames';
import { CommonProps } from '../../types';
import { Styles, ClassNames, RowCount } from './style';
import { formatLocaleTime } from '../../common/lib/date';
import { EntryLogApi } from '../../common/api';
import { EntryList, Entry, SignInOutResponse } from '../../common/model/entry_log';
import { NameInputDialog } from '../../components/NameInputDialog';

interface Props extends CommonProps {
  getDayView: EntryLogApi['getDayView'];
  toggle: EntryLogApi['toggle'];
  signInWithNewMember: EntryLogApi['signInWithNewMember'];
}

interface State {
  entryList: EntryList;

  nameDialog: NameDialog | null;
}

interface NameDialog {
  code: string;
  name: string;
}

export const EntryPage = withStyles(Styles)(
  class extends React.PureComponent<Props & WithStyles<ClassNames>, State> {
    constructor(props: Props & WithStyles<ClassNames>) {
      super(props);

      this.state = {
        entryList: {
          entries: [],
        },

        nameDialog: null,
      };
    }

    async componentDidMount() {
      const { app, getDayView, toggle } = this.props;

      const view = await getDayView();

      this.updateEntryView(view);

      app.onLine(async (code) => {
        if (this.state.nameDialog) return;

        const result = await toggle(code);

        this.handleResponse(result);
      });
    }

    handleResponse(result: SignInOutResponse) {
      if (result.type === 'MemberNotFound') {
        return this.openNameDialog(result.code);
      }

      if (result.type === 'SignIn') {
        responsiveVoice.speak(`Welcome to the People's Production Lab ${result.member.name}`);
      }

      if (result.type === 'SignOut') {
        responsiveVoice.speak(`Good bye ${result.member.name}`);
      }

      this.updateEntryView(result.entryList);
    }

    openNameDialog(code: string) {
      responsiveVoice.speak(`We haven't seen this card before. Please register it by entering your name...`);

      this.setState({
        nameDialog: { code, name: '' },
      });
    }

    updateEntryView(entryList: EntryList) {
      this.setState({
        entryList: { entries: entryList.entries.slice(0, RowCount) },
      });
    }

    handleNameChange(name: string) {
      if (!this.state.nameDialog) return;

      this.setState({
        nameDialog: { code: this.state.nameDialog.code, name },
      });
    }

    handleNameCancel() {
      this.setState({
        nameDialog: null,
      });
    }

    async handleNameSubmit() {
      if (this.state.nameDialog) {
        const { code, name } = this.state.nameDialog;

        // Empty string or begins with 0 is considered a cancel
        if (name.length === 0 || name.charCodeAt(0) === 48) {
          return this.handleNameCancel();
        }

        this.setState({
          nameDialog: null,
        });

        const result = await this.props.signInWithNewMember(code, name);

        this.handleResponse(result);
      }
    }

    render() {
      const { classes } = this.props;

      function Entry(entry: Entry) {
        return (
          <div key={entry.member_id} className={classes.row}>
            <div className={classNames(classes.cell, classes.name)}>
              {entry.name}
            </div>
            <div className={classNames(classes.cell, classes.signInTime)}>
              {entry.signInTime ? formatLocaleTime(entry.signInTime) : ''}
            </div>
            <div className={classNames(classes.cell, classes.signOutTime)}>
              {entry.signOutTime ? formatLocaleTime(entry.signOutTime) : ''}
            </div>
          </div>
        );
      }

      return (
        <div className={classes.page}>
          {
            this.state.nameDialog &&
            <NameInputDialog
              title='Please enter your name...'
              buttonText='Sign in'
              onChange={(name) => this.handleNameChange(name)}
              onCancel={() => this.handleNameCancel()}
              onSubmit={() => this.handleNameSubmit()} />
          }

          <div className={classes.table}>
            {
              this.state.entryList.entries.map(Entry)
            }
          </div>
        </div>
      );
    }
  },
);
