import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui';
import { PartialMember } from '../../common/model/member';
import { Pane } from '../Pane';
import { mutate, ValidationPair, getMessages } from '../../common/lib';
import { TextField } from '../TextField';
import { ClassNames, Styles } from './style';
import { GridLayout } from '../GridLayout';

interface Props {
  member: ValidationPair<PartialMember>;

  onChange(member: PartialMember): void;
}

export const DataForm = withStyles(Styles)(({ classes, member, onChange }: Props & WithStyles<ClassNames>) => {
  const handleChange = (propName: keyof PartialMember) => (event: React.FormEvent<any> | string) => {
    if (propName === 'id') return;
    if (propName === 'status') return;
    if (propName === 'created_at') return;
    if (propName === 'updated_at') return;

    const value = typeof event === 'string' ? event : (event.target as any).value as string;

    onChange(mutate(member.state, (mutable) => {
      mutable[propName] = value;
    }));
  };

  return (
    <form noValidate autoComplete='off' className={classes.container}>

      <GridLayout minWidth={500} gridGap={24}>

        <Pane title='General' className={classes.pane}>

          <TextField
            label='Name'
            className={classes.textField}
            value={member.state.name || ''}
            messages={getMessages(member.validation.name)}
            onChange={handleChange('name')} />

          <TextField
            label='Email'
            className={classes.textField}
            value={member.state.email || ''}
            messages={getMessages(member.validation.email)}
            onChange={handleChange('email')} />

          <TextField
            label='Code'
            className={classes.textField}
            value={member.state.code || ''}
            messages={getMessages(member.validation.code)}
            onChange={handleChange('code')} />

        </Pane>

        <Pane title='Status' className={classes.pane}>

        </Pane>

      </GridLayout>

    </form>
  );
});
