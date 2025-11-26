import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PathwayStep {
  id: string;
  title: string;
  color: string;
  hoverColor: string;
  description: string;
  details: string;
  imageUrl: string;
}

const pathwaySteps: PathwayStep[] = [
  {
    id: 'new-ideas',
    title: 'New Ideas',
    color: '#B8E6F0',
    hoverColor: '#B8E6F0',
    description: 'Researchers propose bold new studies',
    details: 'The research pathway begins with innovative ideas from talented researchers who apply for Foundation of Hope seed grants to explore new ways of understanding and treating mental illness. These bold proposals reflect fresh thinking and novel approaches that have the potential to transform mental illness care. Through this competitive grant process, the Foundation of Hope provides critical early funding that helps visionary scientists and researchers turn promising ideas into actionable research.',
    imageUrl: 'https://i.ibb.co/k2JVCVNg/Your-gift-is-hope-in-action.png'
  },
  {
    id: 'scientific-review',
    title: 'Scientific Review',
    color: '#2BB673',
    hoverColor: '#2BB673',
    description: 'Projects are rigorously vetted by experts',
    details: 'Every proposal submitted to the Foundation of Hope undergoes rigorous evaluation by our esteemed Scientific Advisory Committee, a panel of leading experts in psychiatry, neuroscience, and mental illness. Each grant application is carefully reviewed for scientific merit, methodological soundness, and potential for impact. Only the most promising studies receive approval and funding, ensuring that every donor dollar supports research with the greatest potential to advance our understanding and treatment of mental illness.',
    imageUrl: 'https://i.ibb.co/JJ6zYTm/3.png'
  },
  {
    id: 'investment',
    title: 'Investment',
    color: '#D4EDD1',
    hoverColor: '#D4EDD1',
    description: 'Your generous gifts fund seed grants',
    details: 'Private donations to the Foundation of Hope provide the vital seed funding that brings approved research projects to life. These generous gifts from individuals, families, and organizations make it possible for scientists to begin their work and gather the preliminary data needed to pursue larger grants. This early investment ignites the research process, turning potential into progress and laying the foundation for future breakthroughs in the study and treatment of mental illness.',
    imageUrl: 'https://i.ibb.co/35X3PFqF/4.png'
  },
  {
    id: 'research-action',
    title: 'Research in Action',
    color: '#4DB8D8',
    hoverColor: '#4DB8D8',
    description: 'Innovative studies begin',
    details: 'Over a three-year period, researchers use Foundation of Hope seed funding to conduct studies that catalyze innovation in the understanding and treatment of mental illness. This early support allows researchers to generate critical preliminary data, proof of concept that strengthens their ability to compete for major external grants. Each study sets the stage for larger, more expansive research, multiplying the impact of every donor dollar and transforming a single seed grant into extraordinary scientific growth.',
    imageUrl: 'https://i.ibb.co/3mXsk8Jk/5.png'
  },
  {
    id: 'major-expansion',
    title: 'Major Expansion',
    color: '#E8F5E9',
    hoverColor: '#E8F5E9',
    description: 'Results attract NIH-level funding',
    details: 'When Foundation of Hope–funded research yields strong preliminary results, researchers can compete for major federal grants from the National Institutes of Health (NIH), the National Institute of Mental Health (NIMH), and other leading organizations. This is where the multiplier effect takes hold: every dollar invested by the Foundation of Hope can generate up to $25 in additional federal funding on average. These new resources expand the scale and reach of the original study, accelerating progress toward more effective treatments for mental illness.',
    imageUrl: 'https://i.ibb.co/G4vJDYTY/6.png'
  },
  {
    id: 'breakthroughs',
    title: 'Breakthroughs',
    color: '#2D8B5F',
    hoverColor: '#2D8B5F',
    description: 'Discoveries that improve lives',
    details: 'The ultimate goal is breakthrough discoveries that transform the understanding and treatment of mental illness. Foundation of Hope–funded research leads to new therapies, better diagnostic tools, and more effective prevention strategies. These advancements translate into real-world impact as individuals recover, families find hope, stigma decreases, and communities grow stronger. This is the lasting power of your investment in research.',
    imageUrl: 'https://i.ibb.co/RpdjdsWG/7.png'
  }
];

export default function ResearchPathway() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = pathwaySteps.length + 1;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const isLastCard = currentIndex === pathwaySteps.length;
  const currentStep = isLastCard ? null : pathwaySteps[currentIndex];

  const isLightBackground = (index: number): boolean => {
    return index % 2 === 0;
  };

  const textColor = isLastCard ? 'text-gray-900' : (isLightBackground(currentIndex) ? 'text-gray-900' : 'text-white');
  const secondaryTextColor = isLastCard ? 'text-gray-700' : (isLightBackground(currentIndex) ? 'text-gray-700' : 'text-white/90');
  const badgeBg = isLightBackground(currentIndex) ? 'bg-gray-900/10' : 'bg-white/20';

  return (
    <div className="relative max-w-3xl mx-auto">
      <div
        className="relative rounded-2xl shadow-xl p-8 md:p-12 min-h-[500px] flex flex-col transition-colors duration-500"
        style={{
          backgroundColor: isLastCard ? '#ffffff' : currentStep?.color
        }}
      >
        {isLastCard ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Support Life-Changing Research
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              Every donation to the Foundation of Hope fuels the research pathway that leads to breakthrough discoveries in mental illness treatment.
            </p>
            <a
              href="#donate"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Make Your Impact Today
            </a>
          </div>
        ) : currentStep && (
          <>
            <div className="mb-6">
              <div className="mb-6">
                <img
                  src={currentStep.imageUrl}
                  alt={currentStep.title}
                  className="w-full h-auto rounded-lg shadow-md mb-4"
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${badgeBg} flex items-center justify-center ${textColor} font-bold text-lg`}>
                    {currentIndex + 1}
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold ${textColor}`}>
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <p className={`text-xl ${secondaryTextColor} italic font-medium`}>
                {currentStep.description}
              </p>
            </div>

            <div className="flex-1">
              <p className={`text-lg ${secondaryTextColor} leading-relaxed`}>
                {currentStep.details}
              </p>
            </div>
          </>
        )}

        <div className={`flex items-center mt-8 pt-6 border-t ${isLastCard || isLightBackground(currentIndex) ? 'border-gray-200' : 'border-white/20'} ${isLastCard ? 'justify-between' : 'justify-between'}`}>
          <button
            onClick={goToPrevious}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
            style={{
              color: isLastCard || isLightBackground(currentIndex) ? '#4B5563' : 'white',
              backgroundColor: isLastCard || isLightBackground(currentIndex) ? '#F3F4F6' : 'rgba(255, 255, 255, 0.2)'
            }}
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentIndex
                    ? (isLastCard || isLightBackground(currentIndex) ? '#2BB673' : 'white')
                    : (isLastCard || isLightBackground(currentIndex) ? '#D1D5DB' : 'rgba(255, 255, 255, 0.4)'),
                  width: index === currentIndex ? '2rem' : '0.5rem'
                }}
                aria-label={`Go to ${index === pathwaySteps.length ? 'donation' : `step ${index + 1}`}`}
              />
            ))}
          </div>

          {!isLastCard && (
            <button
              onClick={goToNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
              style={{
                color: isLightBackground(currentIndex) ? '#4B5563' : 'white',
                backgroundColor: isLightBackground(currentIndex) ? '#F3F4F6' : 'rgba(255, 255, 255, 0.2)'
              }}
              aria-label="Next step"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          {isLastCard && <div className="w-[88px]"></div>}
        </div>
      </div>
    </div>
  );
}
