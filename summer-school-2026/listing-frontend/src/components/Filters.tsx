import type { SlotFilters, Instructor } from '../api/types';

interface FiltersProps {
  filters: SlotFilters;
  instructors: Instructor[];
  onChange: (patch: Partial<SlotFilters>) => void;
  onReset: () => void;
}

export function Filters({ filters, instructors = [], onChange, onReset }: FiltersProps) {
  const activeCount = [
    filters.date_from,
    filters.date_to,
    filters.route_type?.length ? 'x' : '',
    filters.instructor_id?.length ? 'x' : '',
    filters.only_available ? 'x' : '',
  ].filter(Boolean).length;

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Дата</label>
        <div className="filter-row">
          <input
            type="date"
            className="input"
            value={filters.date_from || ''}
            onChange={e => onChange({ date_from: e.target.value || undefined })}
          />
          <span className="filter-sep">—</span>
          <input
            type="date"
            className="input"
            value={filters.date_to || ''}
            onChange={e => onChange({ date_to: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Тип</label>
        <div className="filter-chips">
          {(['novice', 'experienced'] as const).map(t => (
            <button
              key={t}
              className={`chip ${filters.route_type?.includes(t) ? 'active' : ''}`}
              onClick={() => {
                const current = filters.route_type || [];
                const next = current.includes(t)
                  ? current.filter(x => x !== t)
                  : [...current, t];
                onChange({ route_type: next.length ? next : undefined });
              }}
            >
              {t === 'novice' ? 'Новичковый' : 'Опытный'}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Инструктор</label>
        <div className="filter-chips">
          {instructors.map(inst => (
            <button
              key={inst.id}
              className={`chip ${filters.instructor_id?.includes(inst.id) ? 'active' : ''}`}
              onClick={() => {
                const current = filters.instructor_id || [];
                const next = current.includes(inst.id)
                  ? current.filter(x => x !== inst.id)
                  : [...current, inst.id];
                onChange({ instructor_id: next.length ? next : undefined });
              }}
            >
              {inst.name}
            </button>
          ))}
        </div>
      </div>

      <label className="filter-switch">
        <input
          type="checkbox"
          checked={filters.only_available || false}
          onChange={e => onChange({ only_available: e.target.checked || undefined })}
        />
        Только свободные
      </label>

      {activeCount > 0 && (
        <button className="btn reset" onClick={onReset}>
          Сбросить фильтры ({activeCount})
        </button>
      )}
    </div>
  );
}
