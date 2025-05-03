import { useState, useEffect, useRef } from 'react';

const StatisticsSection = () => {
  // Stats data
  const stats = [
    { name: "Balavihar", count: 35, icon: "fas fa-child" },
    { name: "CHYK", count: 30, icon: "fas fa-users" },
    { name: "Members", count: 145, icon: "fas fa-user-friends" },
    { name: "Devi Group", count: 35, icon: "fas fa-hands-praying" }
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Check if element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Start the animation for each stat
          stats.forEach((stat, index) => {
            const duration = 2500; // Increased from 1500ms to 2500ms
            const steps = 50; // Increased from 30 to 50 steps
            const increment = Math.ceil(stat.count / steps);
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.count) {
                current = stat.count;
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
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated, stats]);

  return (
    <div ref={sectionRef} className="bg-white dark:bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#ffe4d6] dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <i className={`${stat.icon} text-[#BC3612] dark:text-[#F47930] text-xl md:text-2xl mb-2`}></i>
              <span className="text-2xl md:text-3xl font-bold text-[#BC3612] dark:text-[#F47930]">
                {counters[index]}+
              </span>
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
                {stat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;