import { useEffect, useState } from 'react';
import { getSlot } from '../api/slots';
import type { Slot } from '../api/types';

interface SlotModalProps {
  slotId: string | null;
  onClose: () => void;
  onBook: (slot: Slot) => void;
}

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

const dt = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' }) + ', ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export function SlotModal({ slotId, onClose, onBook }: SlotModalProps) {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slotId) return;
    setLoading(true);
    setError('');
    getSlot(slotId)
      .then(setSlot)
      .catch(e => setError(e instanceof Error ? e.message : 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [slotId]);

  if (!slotId) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading && <div className="modal-loading">Загрузка…</div>}

        {error && <div className="err-text">{error}</div>}

        {slot && !loading && (
          <>
            <h2>{dt(slot.start_at)}</h2>
            <div className="modal-meta">{slot.route.duration_min} мин</div>

            <div className="modal-section">
              <h3>Маршрут</h3>
              <div className="detail-row">
                <span className="dk">Тип</span>
                <span>{slot.route.type === 'novice' ? 'Новичковый' : 'Опытный'}</span>
              </div>
              <div className="detail-row">
                <span className="dk">Название</span>
                <span>{slot.route.name}</span>
              </div>
              <div className="detail-row">
                <span className="dk">Длительность</span>
                <span>{slot.route.duration_min} мин</span>
              </div>
            </div>

            <div className="modal-section">
              <h3>Инструктор</h3>
              <div className="detail-row">
                <span className="dk">Имя</span>
                <span>{slot.instructor.name}</span>
              </div>
              {slot.meeting_point && (
                <div className="detail-row">
                  <span className="dk">Место встречи</span>
                  <span>{slot.meeting_point}</span>
                </div>
              )}
            </div>

            <div className="modal-section">
              <h3>Доступность</h3>
              <div className="detail-row">
                <span className="dk">Свободно мест</span>
                <span style={{ color: slot.free_seats === 0 ? 'var(--red)' : 'var(--green)' }}>
                  {slot.free_seats} из {slot.total_seats}
                </span>
              </div>
              {slot.free_rental_boards >= 0 && (
                <div className="detail-row">
                  <span className="dk">Прокат досок</span>
                  <span>{slot.free_rental_boards} свободно</span>
                </div>
              )}
            </div>

            <div className="modal-section">
              <h3>Цена</h3>
              <div className="detail-row">
                <span className="dk">Место</span>
                <span>{rub(slot.price)}</span>
              </div>
              <div className="detail-row">
                <span className="dk">Прокат доски</span>
                <span>{rub(slot.rental_price)}</span>
              </div>
            </div>

            {slot.free_seats > 0 && slot.status !== 'cancelled' ? (
              <button className="btn primary modal-book-btn" onClick={() => onBook(slot)}>
                Записаться
              </button>
            ) : (
              <div className="notice">
                {slot.status === 'cancelled' ? 'Слот отменён' : 'Нет свободных мест'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
