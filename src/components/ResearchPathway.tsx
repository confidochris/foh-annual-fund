import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PathwayStep {
  id: string;
  title: string;
  color: string;
  hoverColor: string;
  description: string;
  details: string;
}

const pathwaySteps: PathwayStep[] = [
  {
    id: 'new-ideas',
    title: 'New Ideas',
    color: '#7FC8E8',
    hoverColor: '#5FB0D8',
    description: 'Researchers propose bold new studies',
    details: 'The research pathway begins with innovative ideas from talented researchers who apply for Foundation of Hope seed grants to explore new ways of understanding and treating mental illness. These bold proposals reflect fresh thinking and novel approaches that have the potential to transform mental illness care. Through this competitive grant process, the Foundation of Hope provides critical early funding that helps visionary scientists and researchers turn promising ideas into actionable research.'
  },
  {
    id: 'scientific-review',
    title: 'Scientific Review',
    color: '#A4D65E',
    hoverColor: '#8BC045',
    description: 'Projects are rigorously vetted by experts',
    details: 'Every proposal submitted to the Foundation of Hope undergoes rigorous evaluation by our esteemed Scientific Advisory Committee, a panel of leading experts in psychiatry, neuroscience, and mental illness. Each grant application is carefully reviewed for scientific merit, methodological soundness, and potential for impact. Only the most promising studies receive approval and funding, ensuring that every donor dollar supports research with the greatest potential to advance our understanding and treatment of mental illness.'
  },
  {
    id: 'investment',
    title: 'Investment',
    color: '#4DB8D8',
    hoverColor: '#3A9FC0',
    description: 'Your generous gifts fund seed grants',
    details: 'Private donations to the Foundation of Hope provide the vital seed funding that brings approved research projects to life. These generous gifts from individuals, families, and organizations make it possible for scientists to begin their work and gather the preliminary data needed to pursue larger grants. This early investment ignites the research process, turning potential into progress and laying the foundation for future breakthroughs in the study and treatment of mental illness.'
  },
  {
    id: 'research-action',
    title: 'Research in Action',
    color: '#2BB673',
    hoverColor: '#229A5E',
    description: 'Innovative studies begin',
    details: 'Over a three-year period, researchers use Foundation of Hope seed funding to conduct studies that catalyze innovation in the understanding and treatment of mental illness. This early support allows researchers to generate critical preliminary data, proof of concept that strengthens their ability to compete for major external grants. Each study sets the stage for larger, more expansive research, multiplying the impact of every donor dollar and transforming a single seed grant into extraordinary scientific growth.'
  },
  {
    id: 'major-expansion',
    title: 'Major Expansion',
    color: '#B8D89E',
    hoverColor: '#A0C585',
    description: 'Results attract NIH-level funding',
    details: 'When Foundation of Hope–funded research yields strong preliminary results, researchers can compete for major federal grants from the National Institutes of Health (NIH), the National Institute of Mental Health (NIMH), and other leading organizations. This is where the multiplier effect takes hold: every dollar invested by the Foundation of Hope can generate up to $25 in additional federal funding on average. These new resources expand the scale and reach of the original study, accelerating progress toward more effective treatments for mental illness.'
  },
  {
    id: 'breakthroughs',
    title: 'Breakthroughs',
    color: '#2D8B5F',
    hoverColor: '#237049',
    description: 'Discoveries that improve lives',
    details: 'The ultimate goal is breakthrough discoveries that transform the understanding and treatment of mental illness. Foundation of Hope–funded research leads to new therapies, better diagnostic tools, and more effective prevention strategies. These advancements translate into real-world impact as individuals recover, families find hope, stigma decreases, and communities grow stronger. This is the lasting power of your investment in research.'
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

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-[500px] flex flex-col">
        {isLastCard ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Support Life-Changing Research
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              Every donation to the Foundation of Hope fuels the research pathway that leads to breakthrough discoveries in mental illness treatment.
            </p>
            <a
              href="#donation"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Make Your Impact Today
            </a>
          </div>
        ) : currentStep && (
          <>
            <div className="mb-6">
              <div
                className="inline-block px-4 py-2 rounded-lg mb-4"
                style={{ backgroundColor: `${currentStep.color}20` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: currentStep.color }}
                  >
                    {currentIndex + 1}
                  </div>
                  <h3
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: currentStep.color }}
                  >
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <p className="text-xl text-gray-600 italic">
                {currentStep.description}
              </p>
            </div>

            <div className="flex-1">
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentStep.details}
              </p>
            </div>
          </>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={goToPrevious}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
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
                    ? (index === pathwaySteps.length ? '#2BB673' : pathwaySteps[index].color)
                    : '#D1D5DB',
                  width: index === currentIndex ? '2rem' : '0.5rem'
                }}
                aria-label={`Go to ${index === pathwaySteps.length ? 'donation' : `step ${index + 1}`}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            aria-label="Next step"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
