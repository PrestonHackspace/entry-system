import * as React from 'react';
import { Table, TBody, TR, TD, A } from 'oy-vey';

import { EmptySpace } from './EmptySpace';
import { Button } from '../types';

interface FooterProps {
  width: number;
  color: string;

  leftButton?: Button;
  rightButton?: Button;
}

export const Footer = ({ color, width, leftButton, rightButton }: FooterProps) => {
  const style = {
    color,
    backgroundColor: '#dddddd',
  };

  const spaceStyle = {
    lineHeight: '1px',
    fontSize: '1px',
  };

  return (
    <Table
      width='100%'
      style={style}>
      <TBody>

        <TR>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
        </TR>

        <TR>
          <TD
            height='1'
            width='20'
            style={spaceStyle}>&nbsp;</TD>

          <TD>
            <Table width={(width / 2 - 30)}>
              <TBody>
                <TR>
                  {
                    leftButton ?
                      <TD
                        align='center'
                        bgColor='#2DB5AD'
                        style={{ fontFamily: 'Arial' }}>

                        <EmptySpace height='10' />

                        <A style={{ color: '#fff', fontWeight: 'bold' as 'bold', textDecoration: 'none' }} href={leftButton.link}>{leftButton.label}</A>

                        <EmptySpace height='10' />
                      </TD>
                      : null
                  }
                </TR>
              </TBody>
            </Table>
          </TD>

          <TD
            height='1'
            width='20'
            style={spaceStyle}>&nbsp;</TD>

          <TD>
            <Table width={(width / 2 - 30)}>
              <TBody>
                <TR>
                  {
                    rightButton ?
                      <TD
                        align='center'
                        bgColor='#2DB5AD'
                        style={{ fontFamily: 'Arial' }}>

                        <EmptySpace height='10' />

                        <A style={{ color: '#fff', fontWeight: 'bold' as 'bold', textDecoration: 'none' }} href={rightButton.link}>{rightButton.label}</A>

                        <EmptySpace height='10' />
                      </TD>
                      : null
                  }
                </TR>
              </TBody>
            </Table>
          </TD>

          <TD
            height='1'
            width='20'
            style={spaceStyle}>&nbsp;</TD>
        </TR>

        <TR>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
          <TD><EmptySpace height='20' /></TD>
        </TR>
      </TBody>
    </Table>
  );
};
