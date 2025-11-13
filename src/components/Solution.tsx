import { Lightbulb } from 'lucide-react';
import ResearchPathway from './ResearchPathway';
import NextSection from './NextSection';

export default function Solution() {
  return (
    <section id="solution" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-foh-light-green/10 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Unfolding the Solution
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            From Ideas to Impact
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12">
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-xl sm:text-2xl text-foh-dark-brown leading-relaxed mb-6 font-semibold">
                The Foundation of Hope believes that groundbreaking research is the pathway to understanding, treating, and ultimately conquering mental illness.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Through our partnership with UNC Chapel Hill's Department of Psychiatry, we fund innovative research that addresses the root causes of mental illness and develops effective treatment pathways.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Our research investment strategy creates a multiplier effect, with every dollar generating up to <span className="font-bold text-foh-mid-green text-xl">25x</span> in additional funding through grants and collaborative partnerships.
              </p>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-foh-dark-brown inline">
                Our{' '}
              </h3>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold inline" style={{ color: '#2BB673' }}>
                RESEARCH
              </h3>
              <h3 className="text-2xl sm:text-3xl font-bold text-foh-dark-brown inline">
                {' '}Pathway
              </h3>
            </div>

            <ResearchPathway />
          </div>

          <NextSection targetId="research" label="Our Research" />
        </div>
      </div>
    </section>
  );
}
