export default function LogoBanner() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-2 sm:py-3 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <a
          href="https://www.walkforhope.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity duration-200"
        >
          <img
            src="https://i.ibb.co/p62nSHVy/Fo-H-Logo-Horizontal-Tagline-Full-Color.png"
            alt="Foundation of Hope"
            className="h-16 sm:h-20 md:h-24 w-auto"
          />
        </a>
      </div>
    </div>
  );
}
