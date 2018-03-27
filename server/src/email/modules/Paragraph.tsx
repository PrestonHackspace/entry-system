import * as React from 'react';
import { Table, TBody, TR, TD } from 'oy-vey';
import { EmptySpace } from './EmptySpace';

interface TextProps {
  children: string;
}

export const Paragraph = ({ children }: TextProps) => {
  const textStyle = {
    color: '#42444c',
    backgroundColor: '#eeeeee',
    fontFamily: 'Arial',
    fontSize: '18px',
  };

  return (
    <Table width='100%'>
      <TBody>
        <TR>
          <TD align='center' style={textStyle}>
            <EmptySpace height={24} />
            {children}
            <EmptySpace height={24} />
          </TD>
        </TR>
      </TBody>
    </Table>
  );
};
