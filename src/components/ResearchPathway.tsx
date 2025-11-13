import { useState } from 'react';
import { X, ArrowDown } from 'lucide-react';

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
  const [selectedStep, setSelectedStep] = useState<PathwayStep | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        {pathwaySteps.map((step, index) => (
          <div key={step.id} className="relative">
            <button
              onClick={() => setSelectedStep(step)}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              className="w-full text-left transition-all duration-300 transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: hoveredStep === step.id ? step.hoverColor : step.color,
                boxShadow: hoveredStep === step.id ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 10px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                padding: '20px 24px'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm text-white/90">
                    {step.description}
                  </p>
                </div>
              </div>
            </button>

            {index < pathwaySteps.length - 1 && (
              <div className="flex justify-center py-3">
                <ArrowDown className="w-6 h-6 text-gray-400" strokeWidth={3} />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedStep && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setSelectedStep(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStep(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div
              className="inline-block px-4 py-2 rounded-lg mb-4"
              style={{ backgroundColor: `${selectedStep.color}20` }}
            >
              <h3
                className="text-2xl font-bold"
                style={{ color: selectedStep.color }}
              >
                {selectedStep.title}
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed text-lg">
              {selectedStep.details}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
