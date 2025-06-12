import React from 'react';
import { render, screen } from '@testing-library/react';
import WinnerTypo from './WinnerTypo';

describe('WinnerTypo', () => {
  test('displays plaintiff name when win="plaintiff"', () => {
    render(<WinnerTypo win="plaintiff" plaintiff="John" defendant="Jane" />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('displays defendant name when win="defendant"', () => {
    render(<WinnerTypo win="defendant" plaintiff="John" defendant="Jane" />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });
});
