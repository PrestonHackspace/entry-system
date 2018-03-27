import * as React from 'react';
import { Layout } from './layouts/Layout';
import { Header } from './modules/Header';
import { Body } from './modules/Body';
import { Footer } from './modules/Footer';
import { Button } from './types';

export interface HtmlEmailProps {
  message: string;

  leftButton?: Button;
  rightButton?: Button;
}

export function HtmlEmail({ baseUrl, message, ...props }: HtmlEmailProps & { baseUrl: string }) {
  return (
    <Layout width={960}>
      <Header baseUrl={baseUrl} color='#134ac0' />

      <Body verticalSpacing={24} align='left'>
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Body>

      <Footer color='#134ac0' width={960} {...props} />
    </Layout>
  );
}
