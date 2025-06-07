import { useState, useEffect, useRef, useMemo } from 'react';

const FiguresSection = () => {
  const figures = useMemo(() => [
    { name: "Monks", count: 301, icon: "fas fa-user" },
    { name: "Ashrams", count: 300, icon: "fas fa-building" },
    { name: "Schools", count: 300, icon: "fas fa-school" },
  ], []);

  const [counters, setCounters] = useState(figures.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          figures.forEach((figure, index) => {
            const duration = 2500;
            const steps = 50;
            const targetCount = figure.count;
            const increment = Math.ceil(targetCount / steps);
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= targetCount) {
                current = targetCount;
                clearInterval(timer);
              }
              
              setCounters(prevCounters => {
                const newCounters = [...prevCounters];
                newCounters[index] = current;
                return newCounters;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.1 }
    );

    const sectionNode = sectionRef.current;
    if (sectionNode) {
      observer.observe(sectionNode);
    }

    return () => {
      if (sectionNode) {
        observer.unobserve(sectionNode);
      }
    };
  }, [hasAnimated, figures]);

  return (
    <div ref={sectionRef} className="bg-white dark:bg-gray-700 py-1 sm:py-4 sm:px-2 figures-section">
      <style>
        {`
          @media (min-width: 640px) {
            .figures-section {
              padding: 1.5rem 1rem !important;
            }
            .figures-container {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 1.5rem !important;
              justify-items: center !important;
            }
            .figures-card {
              padding: 0.5rem !important;
              min-width: unset !important;
              max-width: 200px !important;
            }
            .figures-icon {
              font-size: 1.25rem !important;
              margin-bottom: 0.5rem !important;
            }
            .figures-count {
              font-size: 1.5rem !important;
            }
            .figures-name {
              font-size: 0.875rem !important;
            }
          }
          @media (min-width: 768px) {
            .figures-container {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 1.5rem !important;
              justify-items: center !important;
            }
            .figures-card {
              padding: 1rem !important;
              max-width: 200px !important;
            }
            .figures-icon {
              font-size: 1.5rem !important;
            }
            .figures-count {
              font-size: 1.875rem !important;
            }
            .figures-name {
              font-size: 1rem !important;
            }
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        {/* Mobile View: Grid layout with 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:hidden text-center">
          {figures.map((figure, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-[10px] font-medium text-[#BC3612] dark:text-[#F47930]">
                {counters[index]}+
              </span>
              <span className="text-[9px] font-medium text-[#BC3612] dark:text-[#F47930]">
                {figure.name}
              </span>
            </div>
          ))}
        </div>
        {/* Tablet and Larger: Original Card Layout */}
        <div className="hidden sm:flex sm:flex-row sm:flex-wrap sm:justify-around sm:gap-2 figures-container text-center">
          {figures.map((figure, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#ffe4d6] dark:bg-gray-800 rounded-lg p-0.5 sm:p-2 figures-card shadow-md hover:shadow-lg transition-shadow"
            >
              <i className={`${figure.icon} text-[#BC3612] dark:text-[#F47930] text-lg figures-icon mb-1 sm:mb-1`}></i>
              <span className="text-base sm:text-lg figures-count font-bold text-[#BC3612] dark:text-[#F47930]">
                {figure.suffix === "Cr+" ? (counters[index] / 10000000).toFixed(1) + "Cr+" : counters[index] + "+"}
              </span>
              <span className="text-[10px] sm:text-xs figures-name font-medium text-gray-800 dark:text-gray-200">
                {figure.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiguresSection;