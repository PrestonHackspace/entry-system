import * as React from 'react';
import { isEqual } from 'lodash';
import { ButtonInfo, CommonProps, FormRequest, isLoadRequest, isNewRequest } from '../../types';
import { UserApi } from '../../common/api';
import { PartialUser, isRole, RoleEnum, UserValidator } from '../../common/model/user';
import { isHumanError, isValid, validate, ValidationPair } from '../../common/lib';
import { withState, PropsWithState } from '../../with-state';
import { AdminLayout } from '../../components/AdminLayout';
import { DataForm } from '../../components/UserForm';

interface Props extends CommonProps {
  getOneUser: UserApi['getOne'];
  saveUser: UserApi['save'];
  deleteUser: UserApi['delete'];

  req: FormRequest;
}

interface State {
  user: ValidationPair<PartialUser> | null;
  ack: FormRequest | null;
}

function getNewModel() {
  return validate({
    role: 'Admin',
    flags: {},
  }, UserValidator);
}

const defaultState: State = {
  user: null,
  ack: null,
};

export const UserEditPage = withState<Props, State>(defaultState,
  (props: PropsWithState<Props, State>) => {

    const { app } = props;

    setTimeout(init, 0);

    function init() {
      if (isEqual(props.req, props.ack)) return;

      let newState: Pick<State, 'user'>;

      if (isLoadRequest(props.req)) {
        newState = {
          user: null,
        };

        load(props.req.id);
      } else if (isNewRequest(props.req)) {
        newState = {
          user: getNewModel(),
        };
      } else {
        throw new Error('Invalid request');
      }

      props.setState({ ...newState, ack: props.req });
    }

    async function load(id: string) {
      const user = await props.getOneUser(id);

      if (!user) throw new Error(`User not found with id "${id}"`);

      props.setState({
        user: validate(user, UserValidator),
      });

      app.setDirty(false);
    }

    async function _new() {
      await app.assertDirty();
    }

    async function save() {
      try {
        if (!props.user) return;

        const [valid, messages] = isValid(props.user.validation);

        if (!valid) {
          console.error(messages);

          throw new Error('Please correct the fields on the form before continuing');
        }

        await props.saveUser(props.user.state);

        app.setDirty(false);

        await app.openAlert({ title: 'Saved', message: 'This user has been successfully saved.' });
      } catch (err) {
        if (isHumanError(err)) {
          app.openAlert(err);
        } else {
          app.openAlert({ title: 'An error occured whilst saving', message: err.message });
        }

        return Promise.reject(err);
      }
    }

    async function del() {
      try {
        if (isLoadRequest(props.req)) {
          const id = props.req.id;

          await app.openPrompt({
            title: 'Delete User',
            message: 'Are you sure you wish to delete this user?',
            onClose: () => Promise.reject(new Error('User not deleted')),
            buttons: [
              {
                label: 'Cancel',
                onClick: () => Promise.reject(new Error('User not deleted')),
              },
              {
                label: 'Delete',
                onClick: async () => {
                  await props.deleteUser(id);
                },
              },
            ],
          });
        }
      } catch (err) {
        if (isHumanError(err)) {
          app.openAlert(err);
        } else if (err.message !== 'User not deleted') {
          app.openAlert({ title: 'An error occured whilst deleting', message: err.message });
        }

        return Promise.reject(err);
      }
    }

    function onFormChange(user: PartialUser) {
      props.setState({ user: validate(user, UserValidator) });

      app.setDirty(true);
    }

    const canNew = isRole(app.role, RoleEnum.Admin);
    const canSave = isRole(app.role, RoleEnum.Admin);
    const canDelete = isRole(app.role, RoleEnum.Admin);

    const buttons: (ButtonInfo | null)[] = [
      canDelete ? { iconKey: 'delete', label: 'Delete User', to: '/users', onClick: del } : null,
      canSave ? { iconKey: 'save', label: 'Save User', colour: 'primary', to: '/users', onClick: save } : null,
      canNew ? { iconKey: 'add', label: 'New User', onClick: _new, to: '/users/new' } : null,
    ];

    return (
      <AdminLayout title='User Edit' toolbarButtons={buttons} app={app}>
        <div>
          {
            props.user &&
            <DataForm
              user={props.user}
              role={app.role}
              onChange={(user) => onFormChange(user)} />
          }
        </div>
      </AdminLayout>
    );

  },
);
