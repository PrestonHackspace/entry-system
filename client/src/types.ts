import { PropTypes } from 'material-ui';
import { Bootstrap } from './common/model/config';
import { User, Session, Role } from './common/model/user';
import { ButtonDialogButton } from './components/ButtonDialog';
import { History } from 'history';

export type IconKey = 'add' | 'save' | 'chevron' | 'edit' | 'tick' | 'delete' | 'more' | 'download' | 'play' | 'stop';

export interface Alert {
  title: string;
  message: string;
}

export interface Prompt extends Alert {
  buttons: ReadonlyArray<PromptButton>;

  onClose: () => Promise<any> | void;
}

export interface PromptButton extends ButtonDialogButton {
  onClick: (button: PromptButton) => Promise<any> | void;
}

export interface CommonProps {
  app: AppProps;
}

interface AppProps {
  bootstrap: Bootstrap;
  authenticatedUser: User | null;
  session: Session | null;
  role: Role;
  drawerOpen: boolean;
  dirty: boolean;
  history: History;

  setSession(session: Session | null): void;
  openAlert(alert: Alert): Promise<void>;
  openPrompt(prompt: Prompt): Promise<void>;
  setDirty(dirty: boolean): void;
  assertDirty(): void;

  onToggleDraw(state?: boolean): void;

  onLine(handler: (line: string) => void): void;
}

export interface ButtonInfo {
  label: string;
  iconKey?: IconKey;
  colour?: PropTypes.Color;
  to?: string;
  onClick?: () => void;
}

export type WithRouter = { history: History };

type LoadFormRequest = { id: string };
type NewFormRequest = { init: 'new' };

export type FormRequest = LoadFormRequest | NewFormRequest;

export function isLoadRequest(formRequest: FormRequest): formRequest is LoadFormRequest {
  return 'id' in formRequest;
}

export function isNewRequest(formRequest: FormRequest): formRequest is NewFormRequest {
  return 'init' in formRequest && formRequest.init === 'new';
}
