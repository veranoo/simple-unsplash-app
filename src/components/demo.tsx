import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Lorem = styled.div`
  background: ${props => props.theme.main};
  display: inline-block;
  padding: 20px;
`;

const theme = {
  main: '#5373cc'
};

const Demo = () => (
  <ThemeProvider theme={theme}>
    <Lorem>xxx</Lorem>
  </ThemeProvider>
);

export default Demo;
