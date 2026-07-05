import { useState, useEffect, useCallback } from 'react';
import { listBookings, cancelBooking } from '../api/bookings';
import { getToken } from '../api/client';
import type { Booking } from '../api/types';

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

const tm = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('active');

  const fetch = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      setBookings([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listBookings(filter === 'all' ? undefined : filter);
      setBookings(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      fetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка отмены');
    }
  };

  const statusLabels: Record<string, string> = {
    active: 'Активные',
    cancelled: 'Отменённые',
    late_cancel: 'С опозданием',
  };

  return (
    <div className="page">
      <h1>Мои бронирования</h1>

      {!getToken() ? (
        <div className="state-msg">
          <p>Войдите, чтобы увидеть бронирования</p>
        </div>
      ) : (
        <>
          <div className="filter-chips" style={{ marginBottom: 16 }}>
            {['active', 'cancelled', 'all'].map(f => (
              <button
                key={f}
                className={`chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Все' : statusLabels[f]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="state-msg">Загрузка…</div>
          ) : error ? (
            <div className="state-msg">
              <p>{error}</p>
              <button className="btn primary" onClick={fetch}>Обновить</button>
            </div>
          ) : !bookings.length ? (
            <div className="state-msg">
              <div className="state-icon">📭</div>
              <h3>Нет бронирований</h3>
            </div>
          ) : (
            <div className="booking-list">
              {bookings.map(b => (
                <div key={b.id} className={`booking-card ${b.status}`}>
                  <div className="booking-header">
                    <span className="booking-status">
                      {statusLabels[b.status] || b.status}
                    </span>
                  </div>
                  <div className="booking-body">
                    <div className="booking-time">{tm(b.slot.start_at)}</div>
                    <div className="booking-route">{b.slot.route.name}</div>
                    <div className="booking-instructor">👤 {b.slot.instructor.name}</div>
                    <div className="booking-summary">
                      {b.seats_count} мест · {rub(b.price)}
                    </div>
                  </div>
                  {b.status === 'active' && (
                    <button
                      className="btn danger"
                      onClick={() => handleCancel(b.id)}
                    >
                      Отменить
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
