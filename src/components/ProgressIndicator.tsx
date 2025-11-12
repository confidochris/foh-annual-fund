import { useState, useEffect } from 'react';

export default function ProgressIndicator() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: 'story', label: "Story" },
    { id: 'about', label: "Foundation" },
    { id: 'problem', label: "Problem" },
    { id: 'solution', label: "Solution" },
    { id: 'research', label: "Investment" },
    { id: 'donate', label: "Donate now!" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) =>
        document.getElementById(section.id)
      );

      let currentIndex = 0;
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentIndex = index;
          }
        }
      });

      setActiveSection(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (index: number) => {
    const element = document.getElementById(sections[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-foh-light-green/30 shadow-lg px-6 py-5">
        <div className="text-foh-dark-brown text-base italic font-serif mb-4 tracking-wide">
          Unfold the...
        </div>
        <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleDotClick(index)}
            className="group flex items-center gap-3"
            aria-label={`Go to ${section.label}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= activeSection
                    ? 'bg-foh-light-green scale-100'
                    : 'bg-gray-300 scale-75'
                }`}
              />
              <span
                className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  index === activeSection
                    ? 'text-foh-dark-brown opacity-100'
                    : index < activeSection
                    ? 'text-gray-400 opacity-100'
                    : 'text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {section.label}
              </span>
            </div>
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}
