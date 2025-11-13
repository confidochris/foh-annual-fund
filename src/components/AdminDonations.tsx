import { useState } from 'react';
import { DollarSign, Plus, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminDonations() {
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            donor_name: donorName || null,
            donor_email: donorEmail || null,
            notes: notes || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully added donation of $${amount}` });
        setAmount('');
        setDonorName('');
        setDonorEmail('');
        setNotes('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add donation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add donation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="max-w-2xl mx-auto">
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

            <div>
              <label htmlFor="donorName" className="block text-sm font-semibold text-foh-dark-brown mb-2">
                Donor Name (Optional)
              </label>
              <input
                type="text"
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foh-mid-green focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
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
      </div>
    </div>
  );
}
