import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import Index from '../pages/index';

test('Test home', () => {
  // Render the component
  const { getByText }: RenderResult = render(<Index />);

  // Assert that the component renders correctly
  const counterHeading: HTMLElement = getByText('Hi, Welcome back');

  expect(counterHeading).toBeInTheDocument();
});
