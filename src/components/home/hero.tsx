"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const slides = [
  {
    image: "/images/chicken.jpg",
    alt: "Herb roasted chicken with rice and greens",
  },
  { image: "/images/pasta.jpg", alt: "Freshly prepared tomato and herb pasta" },
  { image: "/images/brownie.jpg", alt: "Rich chocolate brownie" },
];
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || hovered || reduced.matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused, hovered]);
  return (
    <section className="hero" aria-label="Welcome to Cashless Restaurant">
      <div className="hero-copy">
        <p className="eyebrow">Good food brings people together</p>
        <h1>
          Good Food.
          <br />
          Great Moments.
        </h1>
        <p className="hero-description">
          Fresh flavours, warm hospitality and a little something to look
          forward to. Welcome to Cashless.
        </p>
        <div className="actions">
          <Link className="button" href="/#menu">
            Explore Menu <span aria-hidden>↗</span>
          </Link>
          <Link className="button outline" href="/#order">
            Order Online
          </Link>
        </div>
        <p className="hero-note">GOOD FOOD · BETTER TOGETHER</p>
      </div>
      <div
        className="hero-visual"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="(max-width: 700px) 100vw, 58vw"
            preload={index === 0}
            className={index === active ? "hero-image active" : "hero-image"}
            aria-hidden={index !== active}
          />
        ))}
        <div className="hero-shade" />
        <div className="slider-controls">
          <div className="slider-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={active === i}
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={active === i ? "dot active" : "dot"}
              />
            ))}
          </div>
          <button
            className="slider-pause"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
    </section>
  );
}
