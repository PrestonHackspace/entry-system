import * as React from 'react';
import { withStyles, TextField, Grid, WithStyles, Typography } from 'material-ui';
import { CommonProps, ButtonInfo } from '../../types';
import { Theme } from 'material-ui/styles';
import returnof from 'returnof';
import { ConfigApi } from '../../common/api';
import { deepFreeze, mutate } from '../../common/lib';
import { ChangeEvent } from 'react';
import { Pane } from '../../components/Pane';
import { Config, ConfigKey, ConfigDummy, ConfigMap } from '../../common/model/config';
import { AdminLayout } from '../../components/AdminLayout';

const styles = (theme: Theme) => ({
  paper: {
    padding: theme.spacing.unit * 3,
  },

  textField: {
    width: '100%',
  },

  textFieldContainer: {
    alignSelf: 'center',
  } as React.CSSProperties,

  description: {
    color: theme.palette.getContrastText(theme.palette.background.default),
  },

  terms: {
    width: '100%',
  },
});

const styleReturn = returnof(styles);

interface Props extends CommonProps {
  getConfigValues: ConfigApi['getValues'];
  setConfigValue: ConfigApi['setValue'];
}

interface State {
  config: Config;
  loading: boolean;
  open: { [key: string]: boolean | undefined };
}

interface Fields {
  [title: string]: FieldDefinition[];
}

interface FieldDefinition {
  key: ConfigKey;
  name: string;
  desc: string;
  fieldView: FieldView;
}

interface FieldView {
  (args: FieldViewArgs<any>): JSX.Element;
}

interface FieldViewArgs<T extends string | number | ConfigMap<any> | null> {
  label: string;
  initialValue: T;
  nested?: boolean;
  onChange(newValue: T): void;
}

const TextFieldView: FieldView = (props: FieldViewArgs<string | null>) => {
  return (
    <TextField
      label={props.label}
      defaultValue={props.initialValue || ''}
      style={{ width: '100%' }}
      margin={props.nested ? 'normal' : undefined}
      onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)} />
  );
};

const TextAreaView: FieldView = (props: FieldViewArgs<string | null>) => {
  return (
    <TextField
      label={props.label}
      defaultValue={props.initialValue || ''}
      style={{ width: '100%' }}
      margin={props.nested ? 'normal' : undefined}
      multiline
      onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)} />
  );
};

// const NumberFieldView: FieldView = (props: FieldViewArgs<number | null>) => {
//   return (
//     <TextField
//       label={props.label}
//       type='number'
//       defaultValue={props.initialValue ? props.initialValue.toFixed(2) : ''}
//       style={{ width: '100%' }}
//       margin={props.nested ? 'normal' : 'none'}
//       onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(parseFloat(parseFloat(event.target.value).toFixed(2)))} />
//   );
// };

// const MapFieldView = <T extends string | number>(fields: ReadonlyArray<string>, FieldView: FieldView): FieldView => {
//   return (props: FieldViewArgs<ConfigMap<T>>) => {
//     const changeValue = (field: string, newValue: T) => {
//       if (typeof newValue !== 'number' || isNaN(newValue) || props.initialValue[field] === newValue) return;

//       props.onChange(mutate(props.initialValue, (mutable) => {
//         mutable[field] = newValue;
//       }));
//     };

//     return (
//       <div>
//         {
//           fields.map((field) => {
//             return <FieldView
//               key={field}
//               label={`${props.label} - ${field}`}
//               initialValue={props.initialValue[field]}
//               nested={true}
//               onChange={(newValue) => changeValue(field, newValue)} />;
//           })
//         }
//       </div>
//     );
//   };
// };

const Fields: Fields = {
  'Email Addresses': [
    {
      key: 'systemFromEmail',
      name: 'System From Email',
      desc: 'The "from" address for all emails sent out by the system.',
      fieldView: TextFieldView,
    },
    {
      key: 'adminNotificationEmails',
      name: 'Additional Admin Notification Emails',
      desc: 'Additional "to" addresses for all admin notification emails, separated by semicolons (;).',
      fieldView: TextFieldView,
    },
  ],

  'Confirm Email Address Email': [
    {
      key: 'confirmEmailAddressEmailSubject',
      name: 'Confirm Email Address - Subject',
      desc: 'Subject line for email asking user to confirm email address',
      fieldView: TextAreaView,
    },
    {
      key: 'confirmEmailAddressEmailMessage',
      name: 'Confirm Email Address - Message',
      desc: 'Message text for email asking user to confirm email address',
      fieldView: TextAreaView,
    },
  ],

  'New User Admin Email': [
    {
      key: 'newUserAdminEmailSubject',
      name: 'New User Admin - Subject',
      desc: 'Subject line for admin notification of new user',
      fieldView: TextAreaView,
    },
    {
      key: 'newUserAdminEmailMessage',
      name: 'New User Admin - Message',
      desc: 'Message text for admin notification of new user',
      fieldView: TextAreaView,
    },
  ],

  'Reset Password Email': [
    {
      key: 'resetPasswordEmailSubject',
      name: 'Reset Password - Subject',
      desc: 'Subject line for reset password email',
      fieldView: TextAreaView,
    },
    {
      key: 'resetPasswordEmailMessage',
      name: 'Reset Password - Message',
      desc: 'Message text for reset password email',
      fieldView: TextAreaView,
    },
  ],

  'Access Keys': [
    {
      key: 'sesAccessKeyID',
      name: 'SES Access Key ID',
      desc: 'SES credentials for sending email.',
      fieldView: TextFieldView,
    },
    {
      key: 'sesSecretAccessKey',
      name: 'SES Secret Access Key',
      desc: 'SES credentials for sending email.',
      fieldView: TextFieldView,
    },
  ],
};

function getNewModel() {
  return ConfigDummy;
}

export const ConfigEdit: React.ComponentType<Props> = withStyles(styles)(
  class extends React.PureComponent<Props & WithStyles<keyof typeof styleReturn>, State> {
    constructor(props: Props & WithStyles<keyof typeof styleReturn>) {
      super(props);

      this.state = {
        config: getNewModel(),
        open: {},
        loading: true,
      };
    }

    componentWillMount() {
      this.load();
    }

    async load() {
      const config = deepFreeze(await this.props.getConfigValues());

      this.setState({
        config,
        loading: false,
      });
    }

    setValue(key: ConfigKey, value: any) {
      const { config } = this.state;

      this.setState({
        config: mutate(config, (mutable) => {
          mutable[key] = value;
        }),
      });
    }

    async saveProp(key: ConfigKey) {
      try {
        const { config } = this.state;

        const prop = config[key];

        await this.props.setConfigValue(key, prop);
      } catch (err) {
        alert(err.message);

        return Promise.reject(err);
      }
    }

    async save() {
      const { config } = this.state;

      for (const key in config) {
        const configKey = key as ConfigKey;
        // const prop = config[configKey];

        // if (prop.dirty) {
        await this.saveProp(configKey);
        // }
      }

      await this.props.app.openAlert({
        title: 'Saved',
        message: 'Configuration has been successfully saved.',
      });
    }

    toggle(title: string) {
      const { open } = this.state;

      this.setState({
        open: mutate(open, (mutable) => {
          const bu = mutable[title];
          const b = typeof bu === 'undefined' ? false : bu;

          mutable[title] = !b;
        }),
      });
    }

    getFields() {
      const { classes } = this.props;
      const { config, open } = this.state;

      if (!classes) return null;

      return Object.keys(Fields).map((groupTitle) => {
        const groupFields = Fields[groupTitle];

        return (
          <Grid item xs={12} key={groupTitle}>
            <Pane title={groupTitle} paneHidden={!open[groupTitle]} onTitleClick={() => this.toggle(groupTitle)}>
              {
                groupFields.map((field) => (
                  <Grid container spacing={24} key={field.key}>
                    <Grid item xs={12} className={classes.textFieldContainer}>

                      <field.fieldView
                        label={field.name}
                        initialValue={config[field.key]}
                        onChange={(newValue) => this.setValue(field.key, newValue)}
                      />

                    </Grid>

                    <Grid item xs={12} className={classes.textFieldContainer}>
                      <Typography className={classes.description}>{field.desc}</Typography>
                    </Grid>
                  </Grid>
                ))
              }
            </Pane>
          </Grid>
        );
      });
    }

    render() {
      const { app } = this.props;

      const buttons: (ButtonInfo | null)[] = [
        { iconKey: 'save', label: 'Save Config', colour: 'primary', onClick: () => this.save() },
      ];

      return (
        <AdminLayout title='Config Edit Page' toolbarButtons={buttons} app={app}>
          <Grid container spacing={24}>
            {this.getFields()}
          </Grid>,
        </AdminLayout>
      );
    }
  },
);
