"use client"
import { useEffect } from 'react'

export default function ScrollSmootherWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.ScrollSmoother) {
        // @ts-ignore
        window.ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
}
