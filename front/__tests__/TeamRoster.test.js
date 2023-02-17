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

test('renders additional position slot with additional players', async() => {
  const data =[
    {'player_id': 19, 'name': 'Matt Olson', 'position_type': 'P',
    'eligible_positions': ['SP'], 'selected_position':'BN', 'status': ''},
    {'player_id': 20, 'name': 'Jose Altuve', 'position_type': 'B',
    'eligible_positions': ['2B'], 'selected_position':'BN', 'status': ''},
  ]

  render(<TeamRoster data={data}/>);

  await waitFor(() => {
    const positionSlots = screen.getAllByRole('row');
    expect(positionSlots.length).toBe(21)
  })

})