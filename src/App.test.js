import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

test('renders Edson Shop homepage', () => {
  render(
    <MemoryRouter>
      <FavoritesProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoritesProvider>
    </MemoryRouter>
  );
  expect(screen.getAllByText(/Shop by Category/i).length).toBeGreaterThan(0);
});