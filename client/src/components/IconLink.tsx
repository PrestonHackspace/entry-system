import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IconButton } from 'material-ui';
import AddIcon from 'material-ui-icons/Add';
import SaveIcon from 'material-ui-icons/Save';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import EditIcon from 'material-ui-icons/Edit';
import CheckIcon from 'material-ui-icons/Check';
import DeleteIcon from 'material-ui-icons/Delete';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import PlayIcon from 'material-ui-icons/PlayArrow';
import StopIcon from 'material-ui-icons/Stop';
import { ComponentType } from 'react';
import { IconKey } from '../types';

interface Props {
  tooltip: string;
  type: IconKey;
  to?: string;
  shrinkWrap?: boolean;
  style?: React.CSSProperties;

  onClick?: (event: React.SyntheticEvent<{}>) => Promise<any> | void;
}

export const IconLink: ComponentType<Props> = withRouter<Props & RouteComponentProps<string>>((props) => {
  const { tooltip, type, to, shrinkWrap, style, onClick, history } = props;

  async function onClickProxy(event: React.SyntheticEvent<{}>) {
    try {
      if (onClick) {
        const promise = onClick(event);

        if (promise) await promise;
      }

      if (to) {
        history.push(to);
      }
    } catch (err) {
      console.error('onClick', err);
    }
  }

  function getIcon(): React.ReactChild {
    switch (type) {
      case 'add':
        return <AddIcon />;
      case 'save':
        return <SaveIcon />;
      case 'chevron':
        return <ChevronLeftIcon />;
      case 'edit':
        return <EditIcon />;
      case 'tick':
        return <CheckIcon />;
      case 'delete':
        return <DeleteIcon />;
      case 'more':
        return <ExpandMoreIcon />;
      case 'download':
        return <FileDownloadIcon />;
      case 'play':
        return <PlayIcon />;
      case 'stop':
        return <StopIcon />;
    }
  }

  return (
    <a style={style} onClick={onClickProxy}>
      <IconButton color='inherit' title={tooltip} style={shrinkWrap ? { width: 'auto', height: 'auto' } : {}}>
        {getIcon()}
      </IconButton>
    </a>
  );
});
