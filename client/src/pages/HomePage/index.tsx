import * as React from 'react';
import { Link } from 'react-router-dom';
import { CommonProps } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { Pane } from '../../components/Pane';

interface HomePageProps extends CommonProps { }

export function HomePage(props: HomePageProps) {
  const { app } = props;

  function getHomePageContent() {
    if (app.role === 'Anon') {
      return (
        <>
          <p>Welcome to Entry System.</p>

          <p><Link to='/login'>Login</Link></p>

          <p><Link to='/entry'>Go to Entry System</Link></p>
        </>
      );
    }

    return (
      <p>You are now logged in</p>
    );
  }

  return (
    <AdminLayout title='Home Page' toolbarButtons={[]} app={app}>
      <Pane title='Welcome!'>
        {app.authenticatedUser ? <p>Welcome back {app.authenticatedUser.name}.</p> : null}

        {getHomePageContent()}
      </Pane>
    </AdminLayout>
  );
}
