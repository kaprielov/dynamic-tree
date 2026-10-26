import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

// jsdom does not provide structuredClone; the source fixture is JSON-only.
beforeAll(() => {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
});

test('selecting, moving and resetting a document keeps details and hierarchy consistent', async () => {
  render(<App />);
  const roadmap = await screen.findByRole('button', {
    name: 'Release roadmap',
  });
  fireEvent.click(roadmap);
  await screen.findByRole('heading', { name: 'Release roadmap' });
  fireEvent.click(screen.getByRole('button', { name: 'Indent' }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Outdent' })).toBeEnabled(),
  );
  expect(
    screen.getByRole('heading', { name: 'Release roadmap' }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Outdent' }));
  expect(screen.getByRole('button', { name: 'Outdent' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Reset collection' }));
  await screen.findByRole('button', { name: 'Release roadmap' });
  expect(
    screen.queryByRole('heading', { name: 'Release roadmap' }),
  ).not.toBeInTheDocument();
});
