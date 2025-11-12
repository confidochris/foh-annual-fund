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
    details: 'The research pathway begins with innovative ideas from talented researchers who envision new approaches to understanding and treating mental illness. These bold proposals represent fresh thinking and novel methodologies that could transform mental health care. The Foundation of Hope seeks out these pioneering researchers and supports their vision to explore uncharted territory in mental health research.'
  },
  {
    id: 'scientific-review',
    title: 'Scientific Review',
    color: '#A4D65E',
    hoverColor: '#8BC045',
    description: 'Projects are rigorously vetted by experts',
    details: 'Each proposed research project undergoes rigorous scientific review by leading experts in psychiatry, neuroscience, and mental health. This peer review process ensures that funded projects have scientific merit, feasible methodologies, and the potential to generate meaningful insights. Only the most promising research initiatives receive funding, ensuring donors\' investments support truly groundbreaking work.'
  },
  {
    id: 'investment',
    title: 'Investment',
    color: '#4DB8D8',
    hoverColor: '#3A9FC0',
    description: 'Your generous gifts fund seed grants',
    details: 'Private donations to the Foundation of Hope provide the critical seed funding that launches approved research projects. These generous gifts from individuals, families, and organizations make it possible for researchers to begin their work. This initial investment is the catalyst that starts the entire research process and creates opportunities for even greater funding through federal grants.'
  },
  {
    id: 'research-action',
    title: 'Research in Action',
    color: '#2BB673',
    hoverColor: '#229A5E',
    description: 'Innovative studies begin',
    details: 'With funding secured, researchers launch their studies at UNC Chapel Hill\'s Department of Psychiatry and partner institutions. This is where innovative ideas become reality through clinical trials, data collection, laboratory work, and patient studies. Researchers work diligently to test hypotheses, gather evidence, and build the knowledge base that will inform future treatments and interventions.'
  },
  {
    id: 'major-expansion',
    title: 'Major Expansion',
    color: '#B8D89E',
    hoverColor: '#A0C585',
    description: 'Results attract NIH-level funding',
    details: 'Strong preliminary results from Foundation-funded research enable scientists to compete for major federal grants from the National Institutes of Health (NIH), National Institute of Mental Health (NIMH), and other federal agencies. This is where the multiplier effect happens: every dollar from the Foundation of Hope can generate up to $25 in additional federal funding, dramatically expanding the scope and impact of the original research.'
  },
  {
    id: 'breakthroughs',
    title: 'Breakthroughs',
    color: '#2D8B5F',
    hoverColor: '#237049',
    description: 'Discoveries that improve lives',
    details: 'The ultimate goal: breakthrough discoveries that transform mental health care. Foundation-funded research leads to new treatments, improved therapies, better diagnostic tools, and deeper understanding of mental illness. These breakthroughs translate into real-world impact—individuals recover, families find hope, stigma decreases, and communities become healthier. This is the power of your investment in research.'
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
