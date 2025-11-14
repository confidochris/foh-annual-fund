import { Sunrise, TrendingUp, Users, ArrowRight, Globe, Heart } from 'lucide-react';
import NextSection from './NextSection';

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-foh-blue/5 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sunrise className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Unfolding the Foundation
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            Four Decades of Impact
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl shadow-xl p-8 sm:p-10 md:p-12 mb-8" style={{ backgroundColor: 'rgb(241, 248, 232)' }}>
            <div className="prose prose-lg max-w-none">
              <p className="text-base sm:text-lg text-black leading-relaxed mb-6">
                This year, <span className="font-bold">100% of your investment</span> in our Annual Fund will support continued groundbreaking research across all mental illnesses.
              </p>

              <p className="text-base sm:text-lg text-black leading-relaxed font-bold">
                Because lives depend on the breakthroughs ahead.
              </p>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-4 mb-8">
            <img
              src="https://i.ibb.co/DfPR3pgb/SAR02063.jpg"
              alt="Walk for Hope Event"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
            <img
              src="https://i.ibb.co/MyS8L7dV/IMG-WFH-013.png"
              alt="Walk for Hope Community"
              className="w-full h-auto rounded-2xl shadow-lg object-cover"
            />
          </div>

          <img
            src="https://i.ibb.co/DfPR3pgb/SAR02063.jpg"
            alt="Walk for Hope Event"
            className="sm:hidden w-full h-auto rounded-2xl shadow-lg object-cover mb-8"
          />

          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 md:p-12 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                <span className="font-bold text-foh-dark-brown">Founded in 1984</span> by Thad and Alice Eure, the Foundation of Hope has been a steadfast champion for mental illness research and treatment for over four decades.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Through our partnership with the <span className="font-semibold text-foh-mid-green">University of North Carolina at Chapel Hill's Department of Psychiatry</span>, the Foundation funds critical research focused on understanding the root causes of, and potential treatments for, mental illness. We are also committed to raising awareness and supporting effective treatment programs.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We are resolute in our belief that our mission is as relevant today as it was when Thad and Alice Eure began this journey in 1984. Our mission is to <span className="font-bold text-foh-dark-brown">conquer mental illness by investing in groundbreaking scientific research and mental health initiatives</span>.
              </p>
            </div>
          </div>

          <img
            src="https://i.ibb.co/MyS8L7dV/IMG-WFH-013.png"
            alt="Walk for Hope Community"
            className="sm:hidden w-full h-auto rounded-2xl shadow-lg object-cover mb-8"
          />

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-foh-light-green to-foh-mid-green rounded-2xl p-6 sm:p-8 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Research Investment</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold">$10.7M</p>
                <p className="text-sm sm:text-base text-white/90">Initial seed funding</p>
                <div className="pt-3 border-t border-white/20 mt-3">
                  <p className="text-3xl sm:text-4xl font-bold">$272M</p>
                  <p className="text-sm sm:text-base text-white/90">Total leveraged growth</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-foh-blue to-foh-dark-brown rounded-2xl p-6 sm:p-8 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">Legacy of Hope</h3>
              </div>
              <div className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold">40+ Years</p>
                <p className="text-sm sm:text-base text-white/90">Funding breakthrough research</p>
                <p className="text-sm sm:text-base text-white/90 pt-3">
                  Every dollar invested creates a ripple effect, multiplying impact by <span className="font-bold text-2xl">25x</span> through additional grants and funding
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-r from-foh-blue/10 via-foh-light-green/10 to-foh-lime/10 rounded-2xl shadow-lg border border-foh-light-green/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-foh-light-green to-foh-mid-green rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-foh-dark-brown mb-1">
                  Discover the Foundation of Hope
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Learn how we’re accelerating mental illness research
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <a
                href="https://www.walkforhope.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-full font-semibold text-base shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px]"
              >
                Visit Website
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#donate"
                className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-foh-blue to-foh-dark-brown text-white rounded-full font-semibold text-base shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px]"
              >
                Donate Now
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <NextSection targetId="problem" label="The Problem" />
      </div>
    </section>
  );
}
