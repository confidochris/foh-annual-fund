import { useState, useEffect } from 'react';
import { DollarSign, Plus, AlertCircle, CheckCircle, Download, Filter, Search, Calendar, CreditCard, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Donation {
  id: string;
  amount: string;
  donation_type: string;
  status: string;
  created_at: string;
  donor_id: string | null;
  metadata: any;
  donors?: {
    first_name: string;
    last_name: string;
    email: string;
    organization: string | null;
    referral_source: string | null;
    referral_custom: string | null;
  };
}

interface DonorDetails {
  first_name: string;
  last_name: string;
  email: string;
  organization: string | null;
  referral_source: string | null;
  referral_custom: string | null;
  amount: string;
  created_at: string;
}

export default function AdminDonations() {
  const [amount, setAmount] = useState('');
  const [donorFirstName, setDonorFirstName] = useState('');
  const [donorLastName, setDonorLastName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('completed');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<DonorDetails | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDonations();

      const channel = supabase
        .channel('donations-changes-admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'donations' }, () => {
          fetchDonations();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  const fetchDonations = async () => {
    try {
      setIsLoadingDonations(true);
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donors (
            first_name,
            last_name,
            email,
            organization,
            referral_source,
            referral_custom
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
      } else {
        console.log('Fetched donations:', data);
        setDonations(data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setIsLoadingDonations(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Incorrect password' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/add-offline-donation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            first_name: donorFirstName || null,
            last_name: donorLastName || null,
            donor_email: donorEmail || null,
            notes: notes || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully added donation of $${amount}` });
        setAmount('');
        setDonorFirstName('');
        setDonorLastName('');
        setDonorEmail('');
        setNotes('');
        fetchDonations();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add donation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add donation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchQuery === '' ||
      donation.donors?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donors?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donors?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.metadata?.donor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.metadata?.donor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.amount.toString().includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesType = typeFilter === 'all' || donation.donation_type === typeFilter;

    const donationDate = new Date(donation.created_at);
    const matchesDateFrom = !dateFrom || donationDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || donationDate <= new Date(dateTo + 'T23:59:59');

    return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
  });

  const totalRaised = filteredDonations.filter(d => d.status === 'completed').reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Time',
      'First Name',
      'Last Name',
      'Email',
      'Organization',
      'Referral Source',
      'Amount',
      'Currency',
      'Type',
      'Status',
      'Method',
      'Notes'
    ];

    const rows = filteredDonations.map(d => {
      const isOffline = d.metadata?.is_offline || false;
      const referralSource = d.donors?.referral_source === 'Other' && d.donors?.referral_custom
        ? d.donors.referral_custom
        : (d.donors?.referral_source || '');

      return [
        new Date(d.created_at).toLocaleDateString(),
        new Date(d.created_at).toLocaleTimeString(),
        d.donors?.first_name || '',
        d.donors?.last_name || '',
        d.donors?.email || '',
        d.donors?.organization || '',
        referralSource,
        d.amount,
        'USD',
        d.donation_type === 'recurring' ? 'Monthly' : 'One-Time',
        d.status.charAt(0).toUpperCase() + d.status.slice(1),
        isOffline ? 'Offline' : 'Stripe',
        d.metadata?.notes || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-foh-lime/5 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-foh-light-green/10 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-foh-mid-green" />
            </div>
            <h1 className="text-2xl font-bold text-foh-dark-brown mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to manage offline donations</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {message?.type === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-foh-mid-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-foh-light-green transition-colors"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-foh-lime/5 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foh-dark-brown mb-1">All Donations</h2>
              <p className="text-gray-600">View, filter, and export donation records</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={exportToCSV}
                disabled={filteredDonations.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-foh-mid-green text-white rounded-lg font-semibold hover:bg-foh-light-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'pending' ? 'completed' : 'pending')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {statusFilter === 'pending' ? 'Back to Completed' : 'View Abandoned Donations'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="one_time">One-Time</option>
              <option value="recurring">Recurring</option>
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none"
              placeholder="From"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none"
              placeholder="To"
            />
          </div>

          <div className="bg-foh-lime/10 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Raised</div>
                <div className="text-2xl font-bold text-foh-dark-brown">${totalRaised.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Count</div>
                <div className="text-2xl font-bold text-foh-dark-brown">{filteredDonations.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredDonations.filter(d => d.status === 'completed').length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredDonations.filter(d => d.status === 'pending').length}
                </div>
              </div>
            </div>
          </div>

          {isLoadingDonations ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-foh-mid-green border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading donations...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No donations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Donor</th>
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foh-dark-brown">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => {
                    const donorName = donation.donors
                      ? `${donation.donors.first_name} ${donation.donors.last_name}`
                      : 'Anonymous';
                    const donorEmail = donation.donors?.email || '';
                    const notes = donation.metadata?.notes || '';

                    return (
                      <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(donation.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(donation.created_at).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              {donation.donors ? (
                                <button
                                  onClick={() => setSelectedDonor({ ...donation.donors!, amount: donation.amount, created_at: donation.created_at } as any)}
                                  className="font-medium text-foh-mid-green hover:text-foh-light-green underline text-left"
                                >
                                  {donorName}
                                </button>
                              ) : (
                                <div className="font-medium text-foh-dark-brown">{donorName}</div>
                              )}
                              {donorEmail && (
                                <div className="text-xs text-gray-500">{donorEmail}</div>
                              )}
                              {notes && (
                                <div className="text-xs text-gray-600 mt-1 italic">{notes}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-foh-dark-brown text-lg">
                            ${parseFloat(donation.amount).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-foh-blue/10 text-foh-blue">
                            {donation.donation_type === 'recurring' ? 'Monthly' : 'One-Time'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                            donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            {donation.donation_type === 'one_time' || donation.donation_type === 'recurring' ? 'Stripe' : 'Offline'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-foh-light-green/10 rounded-full mb-4">
              <Plus className="w-8 h-8 text-foh-mid-green" />
            </div>
            <h1 className="text-3xl font-bold text-foh-dark-brown mb-2">Add Offline Donation</h1>
            <p className="text-gray-600">Record donations made via check, cash, or other offline methods</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                Donation Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="donorFirstName" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  id="donorFirstName"
                  value={donorFirstName}
                  onChange={(e) => setDonorFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="donorLastName" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                  Last Name (Optional)
                </label>
                <input
                  type="text"
                  id="donorLastName"
                  value={donorLastName}
                  onChange={(e) => setDonorLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="donorEmail" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                Donor Email (Optional)
              </label>
              <input
                type="email"
                id="donorEmail"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                placeholder="donor@example.com"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all resize-none"
                placeholder="Check #1234, received at event, etc."
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foh-mid-green text-white py-4 px-6 rounded-lg font-semibold hover:bg-foh-light-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Donation
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              This donation will be immediately reflected in the campaign progress bar on the main donation page.
            </p>
          </div>
        </div>

        {selectedDonor && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDonor(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foh-dark-brown">Donor Information</h3>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Name</div>
                  <div className="text-lg font-medium text-foh-dark-brown">
                    {selectedDonor.first_name} {selectedDonor.last_name}
                  </div>
                </div>

                {selectedDonor.email && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Email</div>
                    <div className="text-gray-700">{selectedDonor.email}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Amount</div>
                  <div className="text-xl font-bold text-foh-mid-green">${parseFloat(selectedDonor.amount).toLocaleString()}</div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-1">Date</div>
                  <div className="text-gray-700">{new Date(selectedDonor.created_at).toLocaleDateString()} at {new Date(selectedDonor.created_at).toLocaleTimeString()}</div>
                </div>

                {selectedDonor.organization && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Organization</div>
                    <div className="text-gray-700">{selectedDonor.organization}</div>
                  </div>
                )}

                {selectedDonor.referral_source && (
                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">Referral Source</div>
                    <div className="text-gray-700">
                      {selectedDonor.referral_source === 'Other' && selectedDonor.referral_custom
                        ? selectedDonor.referral_custom
                        : selectedDonor.referral_source}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
