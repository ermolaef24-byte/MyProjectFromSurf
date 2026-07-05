import type { SlotSummary } from '../api/types';
import { SlotCard } from './SlotCard';

interface SlotListProps {
  slots: SlotSummary[];
  loading: boolean;
  error: string | null;
  onSlotClick: (slot: SlotSummary) => void;
  onRetry: () => void;
}

export function SlotList({ slots, loading, error, onSlotClick, onRetry }: SlotListProps) {
  if (loading) {
    return (
      <div className="slot-list">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 160, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-msg">
        <div className="state-icon">⚠️</div>
        <h3>Не удалось загрузить</h3>
        <p>{error}</p>
        <button className="btn primary" onClick={onRetry}>Обновить</button>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="state-msg">
        <div className="state-icon">📭</div>
        <h3>Ничего нет</h3>
        <p>Попробуйте изменить фильтры или загляните позже</p>
      </div>
    );
  }

  return (
    <div className="slot-list">
      {slots.map(slot => (
        <SlotCard key={slot.id} slot={slot} onClick={onSlotClick} />
      ))}
    </div>
  );
}
