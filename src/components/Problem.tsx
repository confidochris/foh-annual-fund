import { AlertCircle } from 'lucide-react';
import NextSection from './NextSection';

export default function Problem() {
  return (
    <section id="problem" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Unfolding the Problem
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            The Crisis We Can't Ignore
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-foh-mid-green mb-2">
              MORE THAN 1 IN 5 U.S. ADULTS
            </h3>
            <p className="text-xl sm:text-2xl text-foh-dark-brown font-semibold">
              live with a mental illness
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="rounded-2xl p-8 shadow-lg flex flex-col" style={{ backgroundColor: 'rgb(220, 240, 220)' }}>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-6xl sm:text-7xl font-bold text-foh-mid-green mb-3">
                  2<sup className="text-3xl sm:text-4xl">ND</sup>
                </p>
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg text-foh-dark-brown leading-relaxed">
                  leading cause of death for youth aged 10-24 is suicide
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-8 shadow-lg flex flex-col" style={{ backgroundColor: 'rgb(220, 235, 250)' }}>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-foh-mid-green mb-3">
                  OVER 30 MILLION
                </p>
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg text-foh-dark-brown leading-relaxed">
                  adults struggle with alcohol use disorder
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-8 shadow-lg flex flex-col" style={{ backgroundColor: 'rgb(220, 240, 220)' }}>
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-6xl sm:text-7xl font-bold text-foh-mid-green mb-3">
                  1 IN 8
                </p>
              </div>
              <div className="text-center">
                <p className="text-base sm:text-lg text-foh-dark-brown leading-relaxed">
                  women suffer from postpartum depression
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ backgroundColor: '#2BB673' }}>
            <p className="text-xl sm:text-2xl text-white text-center font-bold leading-relaxed">
              These aren't just statistics. They're a national emergency.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src="https://i.ibb.co/KjDZNVmx/female-college-student-meeting-with-campus-counsel-2024-10-19-23-51-44-utc-min.jpg"
                  alt="Student receiving mental health counseling support"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl sm:text-2xl text-foh-dark-brown leading-relaxed mb-6 font-semibold">
                    Mental illness isn't a future crisis. It's happening now, in every community, in every family, everywhere.
                  </p>

                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                    The recent changes in federal research dollars make private funding pathways like the Foundation of Hope more critical than ever.
                  </p>

                  <p className="text-xl sm:text-2xl text-foh-dark-brown leading-relaxed font-bold mb-6">
                    We can't sit back. We need your help.
                  </p>

                  <p className="text-2xl sm:text-3xl text-foh-mid-green leading-relaxed font-bold">
                    <a href="#donate" className="hover:underline">
                      Please give now.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <NextSection targetId="solution" label="The Solution" />
        </div>
      </div>
    </section>
  );
}
