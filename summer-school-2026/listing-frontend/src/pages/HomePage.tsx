import { useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { Filters } from '../components/Filters';
import { SlotList } from '../components/SlotList';
import { SlotModal } from '../components/SlotModal';
import { BookingForm } from '../components/BookingForm';
import { useSlots } from '../hooks/useSlots';
import type { SlotSummary, Slot } from '../api/types';

interface HomePageProps {
  onAuthSuccess: () => void;
}

export function HomePage({ onAuthSuccess }: HomePageProps) {
  const { slots, loading, error, instructors, filters, updateFilters, resetFilters, refresh } = useSlots();
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotSummary | null>(null);
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null);

  const handleScrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSlotClick = (slot: SlotSummary) => {
    setSelectedSlot(slot);
  };

  const handleCloseSlotModal = () => {
    setSelectedSlot(null);
  };

  const handleBook = (slot: Slot) => {
    setSelectedSlot(null);
    setBookingSlot(slot);
  };

  const handleCloseBooking = () => {
    setBookingSlot(null);
  };

  const handleBookingSuccess = () => {
    setBookingSlot(null);
    refresh();
  };

  return (
    <>
      <Hero onScrollToSchedule={handleScrollToSchedule} />

      <section className="section" ref={scheduleRef} id="schedule">
        <div className="section-inner">
          <div className="section-label">Расписание</div>
          <h2>Свободные слоты</h2>
          <p className="subtitle">Выберите удобное время. Фильтры помогут сузить поиск.</p>

          <Filters
            filters={filters}
            instructors={instructors}
            onChange={updateFilters}
            onReset={resetFilters}
          />

          <SlotList
            slots={slots}
            loading={loading}
            error={error}
            onSlotClick={handleSlotClick}
            onRetry={refresh}
          />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">Точка Опоры</div>
        <p>Скалодром для любого уровня</p>
        <p>© 2026 Точка Опоры</p>
      </footer>

      <SlotModal
        slotId={selectedSlot?.id || null}
        onClose={handleCloseSlotModal}
        onBook={handleBook}
      />

      {bookingSlot && (
        <BookingForm
          slot={bookingSlot}
          onClose={handleCloseBooking}
          onSuccess={handleBookingSuccess}
        />
      )}

    </>
  );
}
