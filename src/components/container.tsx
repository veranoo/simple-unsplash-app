import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
`;

const Container: React.FC = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Container;
