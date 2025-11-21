import { ArrowRight, Heart, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DonationProgress {
  total_raised: number;
  goal_amount: number;
  donor_count: number;
}

export default function Donation() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [progress, setProgress] = useState<DonationProgress>({
    total_raised: 0,
    goal_amount: 100000,
    donor_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const donationTiers = [
    { amount: 50, impact: 'Helps light the spark of discovery' },
    { amount: 150, impact: 'Fuels the work that turns questions into answers' },
    { amount: 500, impact: 'Supports exploring bold new solutions' },
    { amount: 1000, impact: 'Moves us closer to breakthroughs' },
  ];

  useEffect(() => {
    fetchDonationProgress();

    const channel = supabase
      .channel('donations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
        fetchDonationProgress();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDonationProgress = async () => {
    try {
      console.log('Fetching donation progress...');

      const { data: donations, error } = await supabase
        .from('donations')
        .select('amount, status')
        .eq('status', 'completed');

      console.log('Donations query:', { donations, error });

      if (error) {
        console.error('Error fetching donations:', error);
        return;
      }

      const totalRaised = donations?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;
      const donorCount = donations?.length || 0;

      console.log('Calculated:', { totalRaised, donorCount });

      setProgress({
        total_raised: totalRaised,
        goal_amount: 100000,
        donor_count: donorCount,
      });
    } catch (error) {
      console.error('Error fetching donation progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (progress.total_raised / progress.goal_amount) * 100;

  const handleDonateClick = () => {
    const amount = isCustom ? customAmount : selectedAmount;
    console.log('Donating:', amount);
  };

  return (
    <section id="donate" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-foh-blue/5 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" style={{ color: '#2BB673' }} />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: '#2BB673' }}>
              Make Your Gift Today
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foh-dark-brown mb-4 sm:mb-6 px-4">
            Be the Difference
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Your gift today brings us closer to breakthroughs that will transform mental health care
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 mb-8 sm:mb-12">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
              <span className="text-base sm:text-lg font-semibold text-foh-dark-brown">Campaign Progress</span>
              <span className="text-xl sm:text-2xl font-bold text-foh-light-green">
                {isLoading ? '...' : `$${progress.total_raised.toLocaleString()}`}
              </span>
            </div>

            <div className="relative h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-foh-light-green to-foh-mid-green rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-600">{isLoading ? '...' : `${progressPercentage.toFixed(1)}% of goal`}</span>
              <span className="text-gray-600">{isLoading ? '...' : `Goal: $${progress.goal_amount.toLocaleString()}`}</span>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
            <label className="block text-base sm:text-lg font-semibold text-foh-dark-brown mb-4">
              Select Your Gift Amount
            </label>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {donationTiers.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setIsCustom(false);
                  }}
                  className={`group relative p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center active:scale-95 ${
                    selectedAmount === tier.amount && !isCustom
                      ? 'border-foh-light-green bg-foh-light-green/5 shadow-lg'
                      : 'border-gray-200 hover:border-foh-light-green/50 hover:shadow-md'
                  }`}
                >
                  {selectedAmount === tier.amount && !isCustom && (
                    <CheckCircle className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 text-foh-light-green" />
                  )}
                  <div className="text-2xl sm:text-3xl font-bold text-foh-dark-brown mb-1 sm:mb-2">${tier.amount}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600 leading-snug">{tier.impact}</div>
                </button>
              ))}
            </div>

            <div className="relative col-span-2">
              <button
                onClick={() => {
                  setIsCustom(true);
                  setSelectedAmount(null);
                }}
                className={`w-full p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border-2 transition-all duration-300 min-h-[56px] active:scale-95 ${
                  isCustom
                    ? 'border-foh-light-green bg-foh-light-green/5 shadow-lg'
                    : 'border-gray-200 hover:border-foh-light-green/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-semibold text-foh-dark-brown">Custom Amount</span>
                  {isCustom && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-foh-light-green" />}
                </div>
              </button>

              {isCustom && (
                <div className="mt-3 sm:mt-4">
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold text-foh-dark-brown">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-4 text-xl sm:text-2xl font-bold border-2 border-foh-light-green rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-foh-light-green/20"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDonateClick}
            disabled={!selectedAmount && !customAmount}
            className="w-full group px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-foh-light-green to-foh-mid-green text-white rounded-full font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl active:scale-95 sm:hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[56px]"
          >
            Complete Your Gift
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="mt-6 sm:mt-8 flex items-start gap-3 p-4 sm:p-6 bg-foh-lime/10 rounded-lg sm:rounded-xl">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-foh-mid-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foh-dark-brown mb-1 text-sm sm:text-base">100% Community Impact</p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Every dollar you give stays right here in our community, fueling critical research that brings hope and healing to those who need it most. Your gift is fully tax-deductible and makes a lasting impact.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="p-5 sm:p-6 bg-gradient-to-br from-foh-light-green/10 to-foh-blue/10 rounded-lg sm:rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-foh-light-green mb-2">
              41
            </div>
            <div className="text-sm sm:text-base text-gray-700 font-medium">Year Funding Research</div>
          </div>
          <div className="p-5 sm:p-6 bg-gradient-to-br from-foh-lime/10 to-foh-light-green/10 rounded-lg sm:rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-foh-mid-green mb-2">100%</div>
            <div className="text-sm sm:text-base text-gray-700 font-medium">Local Impact</div>
          </div>
          <div className="p-5 sm:p-6 bg-gradient-to-br from-foh-blue/10 to-foh-lime/10 rounded-lg sm:rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-foh-blue mb-2">210</div>
            <div className="text-sm sm:text-base text-gray-700 font-medium">Research Grants Funded</div>
          </div>
        </div>
      </div>
    </section>
  );
}
