import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, CreditCard, Banknote } from 'lucide-react';

interface Donation {
  amount: string;
  status: string;
  created_at: string;
  metadata?: {
    is_offline?: boolean;
  };
}

interface DonationAnalyticsProps {
  donations: Donation[];
}

interface ChartData {
  date: string;
  stripe: number;
  offline: number;
  total: number;
  stripeCount: number;
  offlineCount: number;
  totalCount: number;
}

export default function DonationAnalytics({ donations }: DonationAnalyticsProps) {
  const completedDonations = donations.filter(d => d.status === 'completed');

  const firstDonationDate = useMemo(() => {
    if (completedDonations.length === 0) return '';
    const dates = completedDonations.map(d => new Date(d.created_at));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    return earliest.toISOString().split('T')[0];
  }, [completedDonations]);

  const today = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDonationDate);
  const [endDate, setEndDate] = useState(today);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'stripe' | 'offline'>('all');

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { stripe: number; offline: number; stripeCount: number; offlineCount: number }>();

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + 'T23:59:59') : null;

    completedDonations.forEach(donation => {
      const donationDate = new Date(donation.created_at);

      if (start && donationDate < start) return;
      if (end && donationDate > end) return;

      const dateKey = donationDate.toISOString().split('T')[0];
      const amount = parseFloat(donation.amount);
      const isOffline = donation.metadata?.is_offline || false;

      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, { stripe: 0, offline: 0, stripeCount: 0, offlineCount: 0 });
      }

      const existing = dataMap.get(dateKey)!;
      if (isOffline) {
        existing.offline += amount;
        existing.offlineCount += 1;
      } else {
        existing.stripe += amount;
        existing.stripeCount += 1;
      }
    });

    const sortedData: ChartData[] = Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        stripe: Math.round(data.stripe * 100) / 100,
        offline: Math.round(data.offline * 100) / 100,
        total: Math.round((data.stripe + data.offline) * 100) / 100,
        stripeCount: data.stripeCount,
        offlineCount: data.offlineCount,
        totalCount: data.stripeCount + data.offlineCount
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedData;
  }, [completedDonations, startDate, endDate]);

  const totals = useMemo(() => {
    const stripeTotal = chartData.reduce((sum, day) => sum + day.stripe, 0);
    const offlineTotal = chartData.reduce((sum, day) => sum + day.offline, 0);

    const stripeCount = chartData.reduce((sum, day) => sum + day.stripeCount, 0);
    const offlineCount = chartData.reduce((sum, day) => sum + day.offlineCount, 0);

    let total, count;

    if (sourceFilter === 'stripe') {
      total = stripeTotal;
      count = stripeCount;
    } else if (sourceFilter === 'offline') {
      total = offlineTotal;
      count = offlineCount;
    } else {
      total = stripeTotal + offlineTotal;
      count = stripeCount + offlineCount;
    }

    const avgPerDay = chartData.length > 0 ? total / chartData.length : 0;
    const avgPerDonation = count > 0 ? total / count : 0;

    return {
      total: Math.round(total * 100) / 100,
      stripeTotal: Math.round(stripeTotal * 100) / 100,
      offlineTotal: Math.round(offlineTotal * 100) / 100,
      count,
      stripeCount,
      offlineCount,
      avgPerDay: Math.round(avgPerDay * 100) / 100,
      avgPerDonation: Math.round(avgPerDonation * 100) / 100,
      days: chartData.length
    };
  }, [chartData, sourceFilter]);

  const handleReset = () => {
    setStartDate(firstDonationDate);
    setEndDate(today);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-foh-dark-brown mb-3">
            {new Date(data.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <div className="space-y-2">
            {sourceFilter === 'all' && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8CC63F]"></div>
                    <span className="text-sm text-gray-600">Stripe:</span>
                  </div>
                  <span className="font-bold text-foh-mid-green">
                    ${data.stripe.toLocaleString()} ({data.stripeCount})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4A90E2]"></div>
                    <span className="text-sm text-gray-600">Offline:</span>
                  </div>
                  <span className="font-bold text-foh-blue">
                    ${data.offline.toLocaleString()} ({data.offlineCount})
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-gray-700">Total:</span>
                    <span className="font-bold text-foh-dark-brown text-lg">
                      ${data.total.toLocaleString()} ({data.totalCount})
                    </span>
                  </div>
                </div>
              </>
            )}
            {sourceFilter === 'stripe' && (
              <div>
                <p className="text-foh-mid-green font-bold text-lg">
                  ${data.stripe.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {data.stripeCount} donation{data.stripeCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            {sourceFilter === 'offline' && (
              <div>
                <p className="text-foh-blue font-bold text-lg">
                  ${data.offline.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {data.offlineCount} donation{data.offlineCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (completedDonations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No completed donations to display analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foh-dark-brown mb-1">Donation Analytics</h2>
          <p className="text-gray-600">Daily donation amounts over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-foh-mid-green" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-foh-dark-brown mb-3">
          Filter by Source
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setSourceFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              sourceFilter === 'all'
                ? 'bg-foh-dark-brown text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            All Sources
          </button>
          <button
            onClick={() => setSourceFilter('stripe')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              sourceFilter === 'stripe'
                ? 'bg-foh-mid-green text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Stripe Only
          </button>
          <button
            onClick={() => setSourceFilter('offline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              sourceFilter === 'offline'
                ? 'bg-foh-blue text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Banknote className="w-4 h-4" />
            Offline Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-foh-mid-green/10 to-foh-light-green/10 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-foh-dark-brown">${totals.total.toLocaleString()}</div>
          {sourceFilter === 'all' && (
            <div className="text-xs text-gray-500 mt-1">
              Stripe: ${totals.stripeTotal.toLocaleString()} | Offline: ${totals.offlineTotal.toLocaleString()}
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-foh-blue/10 to-foh-blue/20 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Donations</div>
          <div className="text-2xl font-bold text-foh-dark-brown">{totals.count}</div>
          {sourceFilter === 'all' && (
            <div className="text-xs text-gray-500 mt-1">
              Stripe: {totals.stripeCount} | Offline: {totals.offlineCount}
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-foh-lime/20 to-foh-lime/30 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Days Active</div>
          <div className="text-2xl font-bold text-foh-dark-brown">{totals.days}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Per Day</div>
          <div className="text-2xl font-bold text-foh-dark-brown">${totals.avgPerDay.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Per Donation</div>
          <div className="text-2xl font-bold text-foh-dark-brown">${totals.avgPerDonation.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold text-foh-dark-brown mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={firstDonationDate}
            max={endDate || today}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold text-foh-dark-brown mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || firstDonationDate}
            max={today}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-foh-mid-green text-white rounded-lg font-semibold hover:bg-foh-light-green transition-colors"
        >
          Reset to All Time
        </button>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {sourceFilter === 'all' && (
              <>
                <Bar
                  dataKey="stripe"
                  fill="#8CC63F"
                  radius={[8, 8, 0, 0]}
                  name="Stripe Donations"
                  stackId="a"
                />
                <Bar
                  dataKey="offline"
                  fill="#4A90E2"
                  radius={[8, 8, 0, 0]}
                  name="Offline Donations"
                  stackId="a"
                />
              </>
            )}
            {sourceFilter === 'stripe' && (
              <Bar
                dataKey="stripe"
                fill="#8CC63F"
                radius={[8, 8, 0, 0]}
                name="Stripe Donations"
              />
            )}
            {sourceFilter === 'offline' && (
              <Bar
                dataKey="offline"
                fill="#4A90E2"
                radius={[8, 8, 0, 0]}
                name="Offline Donations"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No donations in the selected date range
        </div>
      )}
    </div>
  );
}
