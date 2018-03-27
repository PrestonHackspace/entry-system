import * as React from 'react';
import { Table, TBody, TR, TD } from 'oy-vey';
import { EmptySpace } from './EmptySpace';

interface BodyProps {
  verticalSpacing?: number;
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

export const Body = ({ verticalSpacing, align, children }: BodyProps) => {
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
          <TD align={align || 'center'} style={textStyle}>
            <EmptySpace height={verticalSpacing || 200} />
            {children}
            <EmptySpace height={verticalSpacing || 200} />
          </TD>
        </TR>
      </TBody>
    </Table>
  );
};
