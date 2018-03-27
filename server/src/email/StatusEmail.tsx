import * as React from 'react';
import { Layout } from './layouts/Layout';
import { Header } from './modules/Header';
import { Body } from './modules/Body';
import { Footer } from './modules/Footer';
import { Button } from './types';

export interface StatusEmailProps {
  message: string;

  leftButton?: Button;
  rightButton?: Button;
}

export function StatusEmail({ baseUrl, message, ...props }: StatusEmailProps & { baseUrl: string }) {
  return (
    <Layout width={600}>
      <Header baseUrl={baseUrl} color='#134ac0' />

      <Body>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Body>

      <Footer color='#134ac0' width={600} {...props} />
    </Layout>
  );
}
