interface HeroProps {
  onScrollToSchedule: () => void;
}

export function Hero({ onScrollToSchedule }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-tag">Скалодром «Точка Опоры»</div>
        <h1><span className="hl">Найди свою</span><br />точку опоры.</h1>
        <p>Современный скалодром с трассами любого уровня сложности. Боулдеринг, верёвки, индивидуальные и групповые занятия — для новичков и профи.</p>
        <button className="btn primary" onClick={onScrollToSchedule}>Записаться на сессию</button>
        <div className="hero-stats">
          <div className="hero-stat"><div className="n">40+</div><div className="l">трасс ежемесячно</div></div>
          <div className="hero-stat"><div className="n">3</div><div className="l">инструктора</div></div>
          <div className="hero-stat"><div className="n">6</div><div className="l">тарифов</div></div>
          <div className="hero-stat"><div className="n">0 ₽</div><div className="l">вход — бесплатно</div></div>
        </div>
      </div>
    </section>
  );
}
