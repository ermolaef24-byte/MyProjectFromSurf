import type { SlotSummary } from '../api/types';

interface SlotCardProps {
  slot: SlotSummary;
  onClick: (slot: SlotSummary) => void;
}

const rub = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

const dayOf = (iso: string) => ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][new Date(iso).getDay()];

const tm = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export function SlotCard({ slot, onClick }: SlotCardProps) {
  const available = slot.free_seats > 0;

  return (
    <div
      className={`slot-card ${!available ? 'full' : ''}`}
      onClick={() => available && onClick(slot)}
    >
      <div className="slot-card-header">
        <span className="slot-type">{slot.route.type === 'novice' ? 'Новичковый' : 'Опытный'}</span>
        <span className="slot-route-name">{slot.route.name}</span>
      </div>
      <div className="slot-card-time">
        {tm(slot.start_at)} <small>({dayOf(slot.start_at)})</small>
      </div>
      <div className="slot-card-meta">
        <span>⏱ {slot.route.duration_min}мин</span>
        <span>👤 {slot.instructor.name}</span>
      </div>
      <div className="slot-card-footer">
        <span className="slot-price">{rub(slot.price)}<small>/место</small></span>
        <span className={`slot-seats ${!available ? 'full' : ''}`}>
          {available ? `${slot.free_seats} / ${slot.total_seats}` : 'Нет мест'}
        </span>
      </div>
    </div>
  );
}
