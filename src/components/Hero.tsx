import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  const scrollToStory = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDonate = () => {
    document.getElementById('donate')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToResearch = () => {
    document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-8 pb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-foh-blue/15 via-white to-foh-light-green/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <div className="animate-fade-in">
          <h1 className="mb-6 sm:mb-8 px-2">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 mb-2 sm:mb-3">
              <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.225em]" style={{ color: '#2BB673' }}>
                UNFOLDING
              </div>
              <div className="text-6xl sm:text-7xl md:text-8xl font-serif italic font-light leading-none" style={{ fontFamily: 'Georgia, serif', color: '#2BB673' }}>
                hope
              </div>
            </div>
            <div className="text-base sm:text-lg md:text-xl font-light tracking-[0.25em] text-gray-700">
              2025 ANNUAL FUND
            </div>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            The mental health crisis is <span className="font-bold" style={{ color: '#006838' }}>REAL</span>. The time to act is <span className="font-bold" style={{ color: '#006838' }}>NOW</span>.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch mb-8 sm:mb-12 mx-4">
            <div className="bg-white rounded-lg border-4 border-foh-light-green shadow-xl p-6 sm:p-8 w-full md:w-80 flex flex-col justify-center">
              <div className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.3em] mb-2" style={{ color: '#2BB673' }}>
                OUR GOAL
              </div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-light italic mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2BB673' }}>
                $150,000
              </div>
              <div className="text-sm sm:text-base md:text-lg text-gray-800">
                By December 31, 2025
              </div>
            </div>

            <div className="rounded-lg border-4 border-foh-light-green shadow-xl overflow-hidden w-full md:w-80 h-full">
              <img
                src="https://i.ibb.co/B2pnLNxj/Walk4-Hope-Hi-251-min.jpg"
                alt="Walk for Hope"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 max-w-3xl mx-auto">
            <button
              onClick={scrollToDonate}
              className="group w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-full font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px] whitespace-nowrap"
            >
              Give Hope Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={scrollToStory}
              className="group w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white/90 backdrop-blur-sm text-foh-dark-brown rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-foh-light-green/30 min-h-[52px] whitespace-nowrap"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              Watch Marilyn's Story
            </button>

            <button
              onClick={scrollToResearch}
              className="group w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white/90 backdrop-blur-sm text-foh-dark-brown rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-foh-light-green/30 min-h-[52px] whitespace-nowrap"
            >
              See How Hope Unfolds
            </button>
          </div>

          <button
            onClick={scrollToStory}
            className="mt-8 flex justify-center mx-auto hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll to story section"
          >
            <svg
              className="w-8 h-8 text-foh-light-green opacity-60"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
