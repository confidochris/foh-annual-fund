import { useState } from 'react';
import { Microscope, ExternalLink, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import NextSection from './NextSection';

interface Paper {
  title: string;
  url: string;
}

interface ResearcherProps {
  name: string;
  title: string;
  focus: string;
  currentResearch: string;
  image: string;
  papers: Paper[];
  universityUrl?: string;
}

function ResearcherCard({ name, title, focus, currentResearch, image, papers, universityUrl }: ResearcherProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-foh-blue/10 to-foh-light-green/10">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8 sm:p-10 flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-foh-dark-brown mb-2">{name}</h3>
            <p className="text-foh-mid-green font-semibold text-base sm:text-lg">{title}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Microscope className="w-5 h-5 text-foh-orange flex-shrink-0" />
              <span className="font-semibold text-foh-dark-brown">Research Focus</span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{focus}</p>
          </div>

          <div className="mb-6 flex-1">
            <h4 className="font-semibold text-foh-dark-brown mb-2">Current Research</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{currentResearch}</p>
          </div>

          {universityUrl && (
            <div className="mb-6">
              <a
                href={universityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foh-mid-green hover:text-foh-light-green transition-colors font-semibold group/learn"
              >
                <span>Learn More</span>
                <ExternalLink className="w-4 h-4 group-hover/learn:translate-x-0.5 group-hover/learn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-foh-light-green flex-shrink-0" />
              <span className="text-sm font-semibold text-foh-dark-brown">Published Papers</span>
            </div>
            <div className="space-y-2">
              {papers.length > 0 ? (
                papers.map((paper, idx) => (
                  <a
                    key={idx}
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-foh-mid-green hover:text-foh-light-green transition-colors group/link"
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    <span className="line-clamp-2">{paper.title}</span>
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No published papers available at this time.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Research() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const researchers: ResearcherProps[] = [
    {
      name: "Dr. Joyce Besheer",
      title: "Associate Director, Bowles Center for Alcohol Studies",
      focus: "Understanding the neural mechanisms that contribute to alcohol use disorders and drug addiction.",
      currentResearch: "Dr. Joyce Besheer's research explores whether semaglutide—a medication commonly used for diabetes and weight management—can reduce the brain's response to alcohol. With alcohol use disorder affecting millions and few effective treatment options available, her work could uncover a new therapeutic pathway and demonstrate how existing medications can be repurposed to address mental health and addiction challenges.",
      image: "https://i.ibb.co/Pv2y276r/JBesheer-headshot-Nov-2024-600x900-jpg.jpg",
      papers: [
        { title: "Semaglutide, tirzepatide, and retatrutide attenuate the interoceptive effects of alcohol in male and female rats.", url: "https://pubmed.ncbi.nlm.nih.gov/40699363/" },
        { title: "The GPR88 Agonist RTI-122 Reduces Alcohol-Related Motivation and Consumption.", url: "https://pubmed.ncbi.nlm.nih.gov/40536830/" },
        { title: "The persistent effects of exposure to a predator odor stressor on sensitivity to alcohol.", url: "https://pubmed.ncbi.nlm.nih.gov/40969972/" }
      ],
      universityUrl: "https://www.med.unc.edu/alcohol/faculty-research-2/joyce-besheer-ph-d/"
    },
    {
      name: "Dr. Adam Miller",
      title: "Associate Director of the CHAAMP Program",
      focus: "Identifying psychological and neurobiological mechanisms linking early childhood adversity with risk for suicide.",
      currentResearch: "Dr. Adam Miller studies how puberty and brain development influence suicide risk in preteen girls. By combining brain imaging, hormone data, and behavioral assessments, his dedicated team seeks to understand why some youth develop self-injurious thoughts while others do not. His goal is to identify early biological and social markers of suicide risk, enabling proactive intervention through data-driven methods before a crisis ever begins.",
      image: "https://i.ibb.co/0yg7LytR/Adam-Miller-1-jpg.jpg",
      papers: [
        { title: "Suicidal Thoughts and Behaviors in Elementary School-Aged Youth: A Pilot Study in 5- to 10-Year-Olds.", url: "https://www.ncbi.nlm.nih.gov/pubmed/40922778/" },
        { title: "Risk and Protective Effects of Need for Approval on Self-Injury in Adolescent Girls.", url: "https://nocklab.fas.harvard.edu/sites/projects.iq.harvard.edu/files/nocklab/files/risk_and_protective_effects_of_need_for_approval_on_self-injury.pdf" },
        { title: "Brain network connectivity during peer evaluation in adolescent females: Associations with age, pubertal hormones, timing, and status.", url: "https://www.sciencedirect.com/science/article/pii/S1878929324000185" }
      ],
      universityUrl: "https://www.med.unc.edu/psych/people/adam-miller/"
    },
    {
      name: "Dr. Parisa Kaliush",
      title: "Postdoctoral Fellow, Reproductive Mood Disorders T32",
      focus: "Postdoctoral research at UNC's NIMH T32 training fellowship in reproductive mood disorders.",
      currentResearch: "Dr. Parisa Kaliush is developing the first suicide prevention program designed specifically for pregnant and postpartum women, one of the most overlooked high-risk populations in mental healthcare. By adapting Brief Cognitive Behavioral Therapy (BCBT) for women experiencing acute distress, her research aims to create a feasible, research-backed treatment that reduces suicide risk and saves lives during the vulnerable perinatal period.",
      image: "https://i.ibb.co/d4BDFxK8/Parisa-Kaliush-jpg.jpg",
      papers: [],
      universityUrl: "https://www.med.unc.edu/psych/people/parisa-kaliush-phd/"
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % researchers.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + researchers.length) % researchers.length);
  };

  return (
    <section id="research" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-foh-lime/5 via-white to-foh-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Microscope className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Unfolding Your Investment
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            Cutting Edge Research Examples
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Meet a few of the dedicated researchers working every day to unlock new treatments and save lives through
            your generous contributions
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto overflow-hidden px-4 md:px-0">
          <div className="relative flex items-center justify-center">
            {/* Previous card peek (desktop only) */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/4 opacity-30 pointer-events-none -translate-x-1/3 scale-90 transition-all duration-500">
              <ResearcherCard {...researchers[(currentIndex - 1 + researchers.length) % researchers.length]} />
            </div>

            {/* Current card */}
            <div className="relative z-10 w-full max-w-4xl transition-all duration-500">
              <ResearcherCard {...researchers[currentIndex]} />
            </div>

            {/* Next card peek (desktop only) */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/4 opacity-30 pointer-events-none translate-x-1/3 scale-90 transition-all duration-500">
              <ResearcherCard {...researchers[(currentIndex + 1) % researchers.length]} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goToPrevious}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-foh-mid-green hover:bg-foh-light-green/10"
              aria-label="Previous researcher"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {researchers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    backgroundColor: index === currentIndex ? '#2BB673' : '#D1D5DB',
                    width: index === currentIndex ? '2.5rem' : '0.75rem',
                    height: '0.75rem'
                  }}
                  aria-label={`Go to researcher ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-foh-mid-green hover:bg-foh-light-green/10"
              aria-label="Next researcher"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-foh-light-green/10 via-foh-blue/10 to-foh-lime/10 rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foh-dark-brown mb-3 sm:mb-4 px-4">
            Your gift is where the next discovery begins.
          </h3>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
            Your donation helps researchers uncover new ways to prevent, treat, and understand mental illness and there has never been a more <span className="font-bold">URGENT</span> time.
          </p>
        </div>

        <NextSection targetId="donate" label="Donate Now" />
      </div>
    </section>
  );
}
