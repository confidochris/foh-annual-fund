import { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'The Story', href: '#story' },
    { label: 'The Foundation', href: '#about' },
    { label: 'The Problem', href: '#problem' },
    { label: 'The Solution', href: '#solution' },
    { label: 'Your Investment', href: '#research' },
    { label: 'Donate Now', href: '#donate', isDonate: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      const sections = ['story', 'about', 'problem', 'solution', 'research', 'donate'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(`#${current}`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a
            href="https://www.walkforhope.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <img
              src="https://i.ibb.co/p62nSHVy/Fo-H-Logo-Horizontal-Tagline-Full-Color.png"
              alt="Foundation of Hope"
              className="h-10 sm:h-12 w-auto hover:opacity-80 transition-opacity"
            />
          </a>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) =>
              item.isDonate ? (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                    activeSection === item.href
                      ? 'bg-foh-light-green/20 text-foh-dark-brown'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="px-5 py-2.5 bg-foh-dark-brown text-white rounded-full font-bold text-base"
            >
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <a
              href="https://www.walkforhope.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img
                src="https://i.ibb.co/p62nSHVy/Fo-H-Logo-Horizontal-Tagline-Full-Color.png"
                alt="Foundation of Hope"
                className="h-10 w-auto"
              />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-8 h-8 text-gray-700" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-6 py-8 space-y-4">
            <button
              onClick={() => handleNavClick('#donate')}
              className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-2xl font-bold text-xl shadow-lg"
            >
              <Heart className="w-6 h-6 fill-white" />
              Donate Now
            </button>

            {navItems.map((item) =>
              !item.isDonate ? (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="px-8 py-5 text-left text-foh-dark-brown font-semibold text-xl rounded-2xl bg-gray-50 border-2 border-gray-300 hover:border-foh-light-green hover:bg-foh-light-green/20 transition-all duration-200 shadow-sm"
                >
                  {item.label}
                </button>
              ) : null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
