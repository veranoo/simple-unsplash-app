import styled from 'styled-components';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #aeffdb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Navbar = memo(() => {
  return (
    <Nav>
      <Link to='/'>
        <img
          width='80px'
          src='http://assets.stickpng.com/thumbs/5cb4839d5f1b6d3fbadece7c.png'
          alt=''
        />
      </Link>
    </Nav>
  );
});

export const Layout: React.FC<{ ref?: any }> = ({ children, ref }) => (
  <LayoutWrapper ref={ref}>
    <Navbar />
    {children}
  </LayoutWrapper>
);
