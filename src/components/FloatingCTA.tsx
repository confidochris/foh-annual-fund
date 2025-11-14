import { Heart, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const shouldShow = isMobile ? !isDismissed : scrollPosition > 800 && !isDismissed;
      setIsVisible(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDismissed]);

  const scrollToDonate = () => {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up max-w-[calc(100vw-2rem)] sm:max-w-sm">
      <div className="relative bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-xl sm:rounded-2xl shadow-2xl p-4 pr-10 sm:pr-12">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-6 sm:h-6 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        </button>

        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base sm:text-lg mb-1">Make an Impact Today</p>
            <p className="text-xs sm:text-sm text-white/90 mb-3">
              Help us reach our $150,000 goal
            </p>
            <button
              onClick={scrollToDonate}
              className="w-full sm:w-auto bg-white text-foh-mid-green px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-foh-lime hover:text-foh-dark-brown active:scale-95 transition-all duration-300 shadow-md min-h-[44px]"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
