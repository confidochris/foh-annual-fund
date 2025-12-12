import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

interface Donation {
  amount: string;
  status: string;
  created_at: string;
}

interface DonationAnalyticsProps {
  donations: Donation[];
}

interface ChartData {
  date: string;
  amount: number;
  count: number;
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

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { amount: number; count: number }>();

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + 'T23:59:59') : null;

    completedDonations.forEach(donation => {
      const donationDate = new Date(donation.created_at);

      if (start && donationDate < start) return;
      if (end && donationDate > end) return;

      const dateKey = donationDate.toISOString().split('T')[0];
      const amount = parseFloat(donation.amount);

      if (dataMap.has(dateKey)) {
        const existing = dataMap.get(dateKey)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        dataMap.set(dateKey, { amount, count: 1 });
      }
    });

    const sortedData: ChartData[] = Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        amount: Math.round(data.amount * 100) / 100,
        count: data.count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sortedData;
  }, [completedDonations, startDate, endDate]);

  const totals = useMemo(() => {
    const total = chartData.reduce((sum, day) => sum + day.amount, 0);
    const count = chartData.reduce((sum, day) => sum + day.count, 0);
    const avgPerDay = chartData.length > 0 ? total / chartData.length : 0;
    const avgPerDonation = count > 0 ? total / count : 0;

    return {
      total: Math.round(total * 100) / 100,
      count,
      avgPerDay: Math.round(avgPerDay * 100) / 100,
      avgPerDonation: Math.round(avgPerDonation * 100) / 100,
      days: chartData.length
    };
  }, [chartData]);

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
          <p className="font-semibold text-foh-dark-brown mb-2">
            {new Date(data.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-foh-mid-green font-bold text-lg">
            ${data.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {data.count} donation{data.count !== 1 ? 's' : ''}
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-foh-mid-green/10 to-foh-light-green/10 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-foh-dark-brown">${totals.total.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-foh-blue/10 to-foh-blue/20 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Donations</div>
          <div className="text-2xl font-bold text-foh-dark-brown">{totals.count}</div>
        </div>
        <div className="bg-gradient-to-br from-foh-lime/20 to-foh-lime/30 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Days Active</div>
          <div className="text-2xl font-bold text-foh-dark-brown">{totals.days}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-4">
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
              formatter={(value) => value === 'amount' ? 'Daily Total' : value}
            />
            <Bar
              dataKey="amount"
              fill="#8CC63F"
              radius={[8, 8, 0, 0]}
              name="Daily Amount"
            />
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
