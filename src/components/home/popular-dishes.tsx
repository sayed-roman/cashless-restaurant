"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { dishes } from "@/data/menu";
import styles from "./popular-dishes.module.css";

export function PopularDishes() {
  const [autoScroll] = useState(() =>
    AutoScroll({
      speed: 0.55,
      startDelay: 800,
      playOnInit: false,
      stopOnInteraction: true,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    }),
  );
  const [viewportRef, carousel] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoScroll],
  );
  const [enabled, setEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!carousel) return;
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    carousel.on("pointerDown", down).on("pointerUp", up);
    return () => {
      carousel.off("pointerDown", down).off("pointerUp", up);
    };
  }, [carousel]);

  useEffect(() => {
    if (!carousel) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (
        !enabled ||
        hovered ||
        focused ||
        dragging ||
        document.hidden ||
        reducedMotion.matches
      ) {
        autoScroll.stop();
      } else {
        autoScroll.play();
      }
    };
    syncMotion();
    reducedMotion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    carousel.on("reInit", syncMotion);
    return () => {
      autoScroll.stop();
      reducedMotion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      carousel.off("reInit", syncMotion);
    };
  }, [carousel, autoScroll, enabled, hovered, focused, dragging]);

  function move(direction: "previous" | "next") {
    if (!carousel) return;
    setEnabled(false);
    autoScroll.stop();
    const instant = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (direction === "next") carousel.scrollNext(instant);
    else carousel.scrollPrev(instant);
  }

  return (
    <section className="section wrap" aria-labelledby="popular-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Our most loved flavours</p>
          <h2 className="section-title" id="popular-title">
            Popular Dishes
          </h2>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            aria-label={
              enabled
                ? "Pause automatic scrolling"
                : "Resume automatic scrolling"
            }
            aria-controls="popular-carousel"
            aria-pressed={!enabled}
            onClick={() => setEnabled((value) => !value)}
          >
            <span aria-hidden="true">{enabled ? "Ⅱ" : "▶"}</span>
          </button>
          <button
            type="button"
            aria-label="Previous dishes"
            aria-controls="popular-carousel"
            onClick={() => move("previous")}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next dishes"
            aria-controls="popular-carousel"
            onClick={() => move("next")}
          >
            →
          </button>
        </div>
      </div>
      <div
        id="popular-carousel"
        ref={viewportRef}
        className={styles.viewport}
        role="region"
        aria-roledescription="carousel"
        aria-label="Popular dishes"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? "next" : "previous");
          }
        }}
      >
        <div className={styles.track}>
          {dishes.map((dish, index) => (
            <div
              className={styles.slide}
              key={dish.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${dishes.length}`}
            >
              <Link
                href={`/menu/${dish.slug}/`}
                className={styles.card}
                draggable={false}
              >
                <div className={styles.photo}>
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    draggable={false}
                    sizes="(max-width: 700px) 82vw, (max-width: 1000px) 50vw, 400px"
                  />
                  <span className={styles.photoLink} aria-hidden="true">
                    View Details ↗
                  </span>
                </div>
                <div className={styles.copy}>
                  <p>{dish.category}</p>
                  <h3>{dish.name}</h3>
                  <span className={styles.details}>
                    View Details <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
