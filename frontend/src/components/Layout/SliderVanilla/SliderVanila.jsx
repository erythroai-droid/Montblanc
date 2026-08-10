"use client";

import React, { useEffect, useState } from "react";
import imageData from "../../../data/package_slider.json";
import ArrowLeft from '../../../icons/ArrowLeft/ArrowLeft.jsx';
import ArrowRight from '../../../icons/ArrowRight/ArrowRight.jsx';
import styles from "./SliderVanilla.module.scss";

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
              <ArrowLeft/>
          </div>
          <div className={styles.arrowRight} onClick={nextSlide}>
              <ArrowRight/>
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