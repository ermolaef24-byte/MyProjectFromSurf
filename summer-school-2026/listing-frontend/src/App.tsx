import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { BookingsPage } from './pages/BookingsPage';
import { getToken } from './api/client';

type Page = 'home' | 'bookings';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const { isAuthenticated, logout } = useAuth();
  const [, setRefreshKey] = useState(0);

  const handleAuthSuccess = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button className="header-logo" onClick={() => setPage('home')}>
            Gravity
          </button>
          <nav className="header-nav">
            <button
              className={`header-link ${page === 'home' ? 'active' : ''}`}
              onClick={() => setPage('home')}
            >
              Расписание
            </button>
            <button
              className={`header-link ${page === 'bookings' ? 'active' : ''}`}
              onClick={() => setPage('bookings')}
            >
              Мои записи
            </button>
            {isAuthenticated ? (
              <button className="header-link" onClick={logout}>
                Выйти
              </button>
            ) : (
              <button className="header-link" onClick={() => setPage('home')}>
                {getToken() ? 'Выйти' : ''}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main>
        {page === 'home' && <HomePage onAuthSuccess={handleAuthSuccess} />}
        {page === 'bookings' && <BookingsPage />}
      </main>
    </div>
  );
}
