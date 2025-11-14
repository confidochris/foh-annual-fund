import { Heart } from 'lucide-react';
import NextSection from './NextSection';

export default function Story() {
  return (
    <section id="story" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 via-white to-foh-lime/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Unfolding Courage
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            A Mother's Heartbreak
          </h2>
          <p className="hidden sm:block text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Marilyn's journey from devastating loss to becoming a champion for mental illness research
          </p>
        </div>

        <div className="sm:hidden aspect-video rounded-xl overflow-hidden shadow-2xl mb-8">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/q6FW-l7Achw"
            title="Marilyn's Story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center mb-12 sm:mb-16">
          <div className="hidden sm:block space-y-6 animate-slide-up order-2 lg:order-1">
            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/q6FW-l7Achw"
                title="Marilyn's Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <div className="max-w-none">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">
                When Marilyn lost her son Marc to suicide, her world shattered. The pain was
                unbearable, the questions endless. But in her grief, she found purpose.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">
                Marc's struggle with mental illness wasn't just a personal tragedy, it was a call to
                action. Marilyn knew that somewhere, in a laboratory or research center, answers were
                waiting to be discovered. Treatments that could save other families from the heartbreak
                she endured.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-medium text-foh-dark-green">
                Today, Marilyn channels her love for her son into hope for others by supporting groundbreaking research through the Foundation of Hope that’s transforming how we understand and treat mental illness.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-xl shadow-lg group">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                src="https://i.ibb.co/MyYYLKYS/marc37.jpg"
                alt="Marilyn and Andrew memories"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foh-dark-brown/80 to-transparent flex items-end p-6">
              <p className="text-white font-medium">Cherished Memories</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl shadow-lg group">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                src="https://i.ibb.co/HL6qcwj1/Besheer-Lab-2-2024.jpg"
                alt="Research and hope"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foh-light-green/80 to-transparent flex items-end p-6">
              <p className="text-white font-medium">Research in Action</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl shadow-lg group">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                src="https://i.ibb.co/XxR6DDWh/colombian-family-smiling-very-happy-daughter-mo-2025-03-09-04-08-07-utc.jpg"
                alt="Hope for the future"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-foh-blue/80 to-transparent flex items-end p-6">
              <p className="text-white font-medium">A Future of Hope</p>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center px-4">
          <div className="inline-block bg-gradient-to-r from-foh-lime/20 to-foh-light-green/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-foh-dark-brown italic">
              "My hope is that there will be no parents sitting in my seat in the future."
            </p>
            <p className="text-base sm:text-lg text-foh-mid-green font-semibold mt-3 sm:mt-4">— Marilyn</p>
          </div>
        </div>

        <NextSection targetId="about" label="The Foundation" />
      </div>
    </section>
  );
}
