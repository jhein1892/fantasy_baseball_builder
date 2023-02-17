import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TeamRoster from '../src/components/teamRoster.js';

test('renders all position slots', async () => {
  render(<TeamRoster />);

  const pitcherHeader = screen.getByText(/pitcher/i);
  expect(pitcherHeader).toBeInTheDocument();

  await waitFor(() => {
    const positionSlots = screen.getAllByRole('row');
    expect(positionSlots.length).toBe(19);
  });
});