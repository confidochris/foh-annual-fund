import { useState } from 'react';
import { X } from 'lucide-react';

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
    imageUrl: 'https://i.ibb.co/N2SqXBg6/I-will-stand-against-my-own-depression-You-ve-helped-me-more-than-anyone-will-ever-know-Marc-s-Forme.png'
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
  const [selectedStep, setSelectedStep] = useState<PathwayStep | null>(null);

  const isLightBackground = (index: number): boolean => {
    return index % 2 === 0;
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pathwaySteps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setSelectedStep(step)}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
          >
            <div className="flex flex-col items-center">
              <div className="w-full h-64 flex items-center justify-center mb-4">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-900/10 flex items-center justify-center text-gray-900 font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 text-center italic">
                {step.description}
              </p>
            </div>
          </button>
        ))}

        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Support Life-Changing Research
          </h3>
          <p className="text-sm mb-6 opacity-90">
            Every donation fuels the research pathway that leads to breakthrough discoveries.
          </p>
          <a
            href="#donate"
            className="inline-block px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            Make Your Impact Today
          </a>
        </div>
      </div>

      {selectedStep && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStep(null)}
        >
          <div
            className="relative rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: selectedStep.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStep(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className={`w-6 h-6 ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'text-gray-900' : 'text-white'}`} />
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 flex flex-col justify-start text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'bg-gray-900/10' : 'bg-white/20'} flex items-center justify-center ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'text-gray-900' : 'text-white'} font-bold text-lg`}>
                    {pathwaySteps.indexOf(selectedStep) + 1}
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'text-gray-900' : 'text-white'}`}>
                    {selectedStep.title}
                  </h3>
                </div>
                <p className={`text-lg ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'text-gray-700' : 'text-white/90'} italic font-medium mb-6`}>
                  {selectedStep.description}
                </p>
                <p className={`text-base ${isLightBackground(pathwaySteps.indexOf(selectedStep)) ? 'text-gray-700' : 'text-white/90'} leading-relaxed`}>
                  {selectedStep.details}
                </p>
              </div>

              <div className="md:w-1/2 flex-shrink-0">
                <div className="w-full h-[40rem] flex items-center justify-center">
                  <img
                    src={selectedStep.imageUrl}
                    alt={selectedStep.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
