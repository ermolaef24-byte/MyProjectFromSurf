import { useState } from 'react';
import type { Slot, SlotSummary } from '../api/types';
import { createBooking } from '../api/bookings';

interface BookingFormProps {
  slot: Slot | SlotSummary;
  onClose: () => void;
  onSuccess: () => void;
}

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
const tm = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};
const nphone = (raw: string) => {
  const d = raw.replace(/\D/g, '');
  const r = d.startsWith('7') ? d.slice(1) : d;
  return r.length === 10 ? '+7' + r : null;
};

interface Participant {
  name: string;
  phone: string;
  is_main: boolean;
  rent_shoes: boolean;
  rent_harness: boolean;
}

export function BookingForm({ slot, onClose, onSuccess, onAuthRequired }: BookingFormProps) {
  const limit = slot.route.capacity_cap;
  const maxSeats = Math.min(limit, slot.free_seats);
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', phone: '', is_main: true, rent_shoes: false, rent_harness: false },
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ik] = useState(() => crypto.randomUUID());

  const adjustParticipants = (n: number) => {
    setParticipants(prev => {
      const arr = [...prev];
      while (arr.length < n) arr.push({ name: '', phone: '', is_main: false, rent_shoes: false, rent_harness: false });
      while (arr.length > n) arr.pop();
      return arr;
    });
  };

  const updateParticipant = (idx: number, field: keyof Participant, value: string | boolean) => {
    setParticipants(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const calcPrice = () => {
    const seats = slot.price * participants.length;
    const shoes = participants.filter(p => p.rent_shoes).length * (slot as Slot).rental_price || 0;
    const harness = participants.filter(p => p.rent_harness).length * (slot as Slot).rental_price || 0;
    return { seats, shoes, harness, total: seats + shoes + harness };
  };

  const price = calcPrice();

  const handleSubmit = async () => {
    const main = participants[0];
    if (!main.name.trim()) { setError('Укажите имя контактного лица.'); return; }
    if (!nphone(main.phone)) { setError('Укажите корректный телефон.'); return; }
    for (let i = 1; i < participants.length; i++) {
      if (!participants[i].name.trim()) { setError('Укажите имя участника ' + (i + 1) + '.'); return; }
    }
    setError('');
    setSubmitting(true);
    try {
      await createBooking({
        slot_id: slot.id,
        seats_count: participants.length,
        rental_count: participants.filter(p => p.rent_shoes).length,
      }, ik);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка бронирования');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Запись на сессию</h2>

        <div className="booking-slot-info">
          <span className="booking-slot-time">{tm(slot.start_at)}</span>
          <span className="booking-slot-type">{slot.route.type === 'novice' ? 'Новичковый' : 'Опытный'} · {slot.route.name}</span>
        </div>

        <div className="booking-section">
          <h3>Участники</h3>
          <div className="seat-selector">
            {Array.from({ length: maxSeats }, (_, i) => (
              <button
                key={i}
                className={`chip ${participants.length === i + 1 ? 'active' : ''}`}
                onClick={() => adjustParticipants(i + 1)}
              >
                {i + 1} {i === 0 ? 'чел' : 'чел'}
              </button>
            ))}
          </div>

          {participants.map((p, i) => (
            <div key={i} className="participant-block">
              <div className="participant-header">
                <span>{p.is_main ? 'Контактное лицо' : `Участник ${i + 1}`}</span>
                {p.is_main && <span className="tag">основной</span>}
              </div>
              <input
                type="text"
                className="input"
                placeholder="Имя"
                value={p.name}
                onChange={e => updateParticipant(i, 'name', e.target.value)}
              />
              {p.is_main && (
                <input
                  type="tel"
                  className="input"
                  placeholder="+7 900 123-45-67"
                  value={p.phone}
                  onChange={e => updateParticipant(i, 'phone', e.target.value)}
                />
              )}
              {'rental_price' in slot && (
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={p.rent_shoes}
                    onChange={e => updateParticipant(i, 'rent_shoes', e.target.checked)}
                  />
                  Прокат доски ({rub(slot.rental_price)})
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="price-breakdown">
          <div className="price-row">
            <span>Место × {participants.length}</span>
            <span>{rub(price.seats)}</span>
          </div>
          {price.shoes > 0 && (
            <div className="price-row">
              <span>Прокат досок</span>
              <span>{rub(price.shoes)}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Итого</span>
            <span>{rub(price.total)}</span>
          </div>
          <div className="payment-note">💵 К оплате на месте</div>
        </div>

        {error && <div className="err-text">{error}</div>}

        <button className="btn primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Бронируем…' : 'Забронировать'}
        </button>
      </div>
    </div>
  );
}
