import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function TopBanner() {
  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/thewalkforhope', label: 'Facebook' },
    { icon: Instagram, url: 'https://www.instagram.com/walkforhope', label: 'Instagram' },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: 'https://www.x.com/walkforhope',
      label: 'X'
    },
    { icon: Youtube, url: 'https://www.youtube.com/@Walkforhope', label: 'YouTube' },
    { icon: Linkedin, url: 'https://www.linkedin.com/company/foundation-of-hope-for-research-and-treatment-of-mental-illness/', label: 'LinkedIn' },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17 2H7C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5zm-5.125 12.5a2.375 2.375 0 110-4.75 2.375 2.375 0 010 4.75zM16.5 9.125a1.375 1.375 0 110-2.75 1.375 1.375 0 010 2.75z"/>
        </svg>
      ),
      url: 'https://www.flickr.com/photos/126626985@N04',
      label: 'Flickr'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#CD6436] to-[#B85830] py-1.5 sm:py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a
          href="https://www.walkforhope.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-white text-xs sm:text-sm transition-colors duration-200 flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Return to</span> site
        </a>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-[#CD6436] hover:bg-gray-100 transition-colors duration-200"
                aria-label={social.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
