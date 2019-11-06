import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import React from 'react';
import Demo from '../demo';

test('Demo test', () => {
  const { getByText } = render(<Demo />);
  expect(getByText('xxx')).toBeInTheDocument()
});
