import { ArrowDown } from 'lucide-react';

interface NextSectionProps {
  targetId: string;
  label: string;
}

export default function NextSection({ targetId, label }: NextSectionProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-center mt-8 sm:mt-12">
      <button
        onClick={handleClick}
        className="group flex flex-col items-center gap-2 px-6 py-3 text-foh-mid-green hover:text-foh-dark-brown transition-colors duration-300"
        aria-label={`Continue to ${label}`}
      >
        <span className="text-sm sm:text-base font-semibold">Continue to {label}</span>
        <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
}
