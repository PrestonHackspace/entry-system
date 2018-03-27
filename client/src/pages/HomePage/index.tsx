import * as React from 'react';
import { Link } from 'react-router-dom';
import { Paper } from 'material-ui';
import { CommonProps } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { Pane } from '../../components/Pane';
import { GridLayout } from '../../components/GridLayout';

interface HomePageProps extends CommonProps { }

export function HomePage(props: HomePageProps) {
  const { app } = props;

  function getHomePageContent() {
    if (app.role === 'Anon') {
      return (
        <>
          <p>Welcome to Entry System. Please <Link to='/login'>login</Link>.</p>

          <p><Link to='/test/123'>Test</Link></p>
        </>
      );
    }

    return (
      <p>You are now logged in</p>
    );
  }

  // responsiveVoice.speak('Hello World');

  return (
    <AdminLayout title='Home Page' toolbarButtons={[]} app={app}>
      <Pane title='Welcome!'>
        {app.authenticatedUser ? <p>Welcome back {app.authenticatedUser.name}.</p> : null}

        {getHomePageContent()}
      </Pane>

      <GridLayout minWidth={500} gridGap={16}>
        <Paper>A</Paper>
        <Paper>B</Paper>
        <Paper>C</Paper>
      </GridLayout>
    </AdminLayout>
  );
}
