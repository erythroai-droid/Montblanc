"use client";

import React, { useEffect, useState } from "react";
import imageData from "../../data/package_slider.json";
import ArrowLeft from '../../icons/ArrowLeft/ArrowLeft.jsx';
import ArrowRight from '../../icons/ArrowRight/ArrowRight.jsx';

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
      <section className="slider">
          <div className="slider__arrow_left" onClick={prevSlide}>
              <ArrowLeft/>
          </div>
          <div className="slider__arrow_right" onClick={nextSlide}>
              <ArrowRight/>
          </div>
          <ul className="slider__items">
              {imageData.map((slide, index) => (
                <li
                  key={slide.id}
                  className={`slider__items-inner ${index === slideIndex ? "active" : ""}`}
                  style={{
                      transform: `translateX(${(index - slideIndex) * 100}%)`,
                  }}
                >
                    <img src={slide.src} alt={slide.title} />
                    <div className="description">
                        <h2>{slide.title}</h2>
                        <p className="price">
                            from <span>{slide.price}</span> ₪ / kg
                        </p>
                        <p className="text">{slide.description}</p>
                    </div>
                </li>
              ))}
          </ul>
          <div className="slider__dots">
              {imageData.map((_, index) => (
                <span
                  key={index}
                  className={`slider__dot ${index === slideIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
          </div>
      </section>
    );
};

export default SliderVanilla;