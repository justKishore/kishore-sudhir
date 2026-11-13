export function AboutHero() {
  return (
    <section data-hero="1" className="hero hero--about" aria-labelledby="about-title">
      <div data-par="1" className="hero__par" aria-hidden />
      <div className="hero__overlay" aria-hidden />
      <div data-dark="1" className="hero__dark" aria-hidden />
      <div data-herotext="1" className="hero__text">
        <div className="about-title-mask">
          <h1 id="about-title" data-reveal="0" className="about-title">
            About
          </h1>
        </div>
      </div>
    </section>
  );
}
