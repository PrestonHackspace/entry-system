import * as React from 'react';
import { isEqual } from 'lodash';
import { ButtonInfo, CommonProps, FormRequest, isLoadRequest, isNewRequest } from '../../types';
import { MemberApi } from '../../common/api';
import { PartialMember, MemberValidator } from '../../common/model/member';
import { isHumanError, isValid, ValidationPair, validate } from '../../common/lib';
import { withState, PropsWithState } from '../../with-state';
import { AdminLayout } from '../../components/AdminLayout';
import { DataForm } from '../../components/MemberForm';
import { RoleEnum, isRole } from '../../common/model/user';

interface Props extends CommonProps {
  getOneMember: MemberApi['getOne'];
  saveMember: MemberApi['save'];
  deleteMember: MemberApi['delete'];

  req: FormRequest;
}

interface State {
  member: ValidationPair<PartialMember> | null;
  ack: FormRequest | null;
}

function getNewModel(): ValidationPair<PartialMember> {
  return validate({}, MemberValidator);
}

const defaultState: State = {
  member: validate({}, MemberValidator),
  ack: null,
};

export const MemberEditPage = withState<Props, State>(defaultState,
  (props: PropsWithState<Props, State>) => {

    console.log('MemberEditPage');

    const { app } = props;

    setTimeout(init, 0);

    function init() {
      if (isEqual(props.req, props.ack)) return;

      let newState: Pick<State, 'member'>;

      if (isLoadRequest(props.req)) {
        newState = {
          member: null,
        };

        load(props.req.id);
      } else if (isNewRequest(props.req)) {
        newState = {
          member: getNewModel(),
        };
      } else {
        throw new Error('Invalid request');
      }

      props.setState({ ...newState, ack: props.req });
    }

    async function load(id: string) {
      const member = await props.getOneMember(id);

      if (!member) throw new Error(`Member not found with id "${id}"`);

      props.setState({
        member: validate(member, MemberValidator),
      });

      app.setDirty(false);
    }

    async function _new() {
      await app.assertDirty();
    }

    async function save() {
      try {
        if (!props.member) return;

        const [valid, messages] = isValid(props.member.validation);

        if (!valid) {
          console.error(messages);

          throw new Error('Please correct the fields on the form before continuing');
        }

        await props.saveMember(props.member.state);

        app.setDirty(false);

        await app.openAlert({ title: 'Saved', message: 'This member has been successfully saved.' });
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
            title: 'Delete Member',
            message: 'Are you sure you wish to delete this member?',
            onClose: () => Promise.reject(new Error('Member not deleted')),
            buttons: [
              {
                label: 'Cancel',
                onClick: () => Promise.reject(new Error('Member not deleted')),
              },
              {
                label: 'Delete',
                onClick: async () => {
                  await props.deleteMember(id);
                },
              },
            ],
          });
        }
      } catch (err) {
        if (isHumanError(err)) {
          app.openAlert(err);
        } else if (err.message !== 'Member not deleted') {
          app.openAlert({ title: 'An error occured whilst deleting', message: err.message });
        }

        return Promise.reject(err);
      }
    }

    function onFormChange(member: PartialMember) {
      props.setState({ member: validate(member, MemberValidator) });

      app.setDirty(true);
    }

    const canNew = isRole(app.role, RoleEnum.Admin);
    const canSave = isRole(app.role, RoleEnum.Admin);
    const canDelete = isRole(app.role, RoleEnum.Admin);

    const buttons: (ButtonInfo | null)[] = [
      canDelete ? { iconKey: 'delete', label: 'Delete Member', to: '/members', onClick: del } : null,
      canSave ? { iconKey: 'save', label: 'Save Member', colour: 'primary', to: '/members', onClick: save } : null,
      canNew ? { iconKey: 'add', label: 'New Member', onClick: _new, to: '/members/new' } : null,
    ];

    return (
      <AdminLayout title='Member Edit' toolbarButtons={buttons} app={app}>
        <div>
          {
            props.member &&
            <DataForm
              member={props.member}
              onChange={onFormChange} />
          }
        </div>
      </AdminLayout>
    );

  },
);
