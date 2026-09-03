"use client";

import React, { useEffect, useState } from "react";
import imageData from "../../../data/package_slider.json";
import styles from "./SliderVanilla.module.scss";

const ArrowLeftIcon = () => (
    <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="35" fill="#46BB22"/>
        <path d="M41 25L29 34.8824L41 45" stroke="white" strokeWidth="2"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="50" height="50" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" transform="rotate(-180 28 28)" fill="#46BB22"/>
        <path d="M23.2 36L32.8 28.0941L23.2 20" stroke="white" strokeWidth="2"/>
    </svg>
);

const SliderVanilla = () => {
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(intervalId);
    }, [slideIndex]);

    const showSlides = (index) => {
        if (index >= imageData.length) {
            setSlideIndex(0);
        } else if (index < 0) {
            setSlideIndex(imageData.length - 1);
        } else {
            setSlideIndex(index);
        }
    };

    const prevSlide = () => {
        showSlides(slideIndex - 1);
    };

    const nextSlide = () => {
        showSlides(slideIndex + 1);
    };

    const goToSlide = (index) => {
        setSlideIndex(index);
    };

    return (
      <section className={styles.slider}>
          <div className={styles.arrowLeft} onClick={prevSlide}>
              <ArrowLeftIcon/>
          </div>
          <div className={styles.arrowRight} onClick={nextSlide}>
              <ArrowRightIcon/>
          </div>
          <ul className={styles.items}>
              {imageData.map((slide, index) => (
                <li
                  key={slide.id}
                  className={`${styles.itemsInner} ${index === slideIndex ? styles.active : ""}`}
                  style={{
                      transform: `translateX(${(index - slideIndex) * 100}%)`,
                  }}
                >
                    <img src={slide.src} alt={slide.title} />
                    <div className={styles.description}>
                        <h2>{slide.title}</h2>
                        <p className={styles.price}>
                            from <span>{slide.price}</span> ₪ / kg
                        </p>
                        <p className={styles.text}>{slide.description}</p>
                    </div>
                </li>
              ))}
          </ul>
          <div className={styles.dots}>
              {imageData.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${index === slideIndex ? styles.active : ""}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
          </div>
      </section>
    );
};

export default SliderVanilla;