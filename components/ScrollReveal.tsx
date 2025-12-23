import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(40px)';
        case 'left': return 'translateX(-40px)';
        case 'right': return 'translateX(40px)';
        default: return 'translateY(40px)';
      }
    }
    return 'translate(0)';
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: '1000ms',
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform, filter',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: isVisible ? 'blur(0)' : 'blur(4px)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};
