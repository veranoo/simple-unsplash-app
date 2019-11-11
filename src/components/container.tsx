import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 15px;
`;

const Container: React.FC = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Container;
