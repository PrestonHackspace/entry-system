import * as React from 'react';
import { Table, TBody, TD, TR, Img } from 'oy-vey';

import { EmptySpace } from './EmptySpace';

interface HeaderProps {
  baseUrl: string;
  color: string;
}

export const Header = ({ baseUrl, color }: HeaderProps) => {
  const style: React.CSSProperties = {
    color,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  };

  return (
    <Table width='100%' height='120' color={color}>
      <TBody>
        <TR>
          <TD style={{ background: '#393939' }} bgColor='#393939'>
            <EmptySpace height={50} />

            {/* Text area, could be another component, i.e. HeroText */}
            <Table width='100%'>
              <TBody>
                <TR>
                  <TD align='center' style={style}>
                    <Img src={`${baseUrl}/img/logo.png`} alt='ES Logo' width={567} height={233} />
                  </TD>
                </TR>
              </TBody>
            </Table>

            <EmptySpace height={50} />
          </TD>
        </TR>
      </TBody>
    </Table>
  );
};
