import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { User, Mail, Shield, AlertCircle, Save, CheckCircle } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.put('/users/profile', { name, email });
      setSuccess('Profile updated successfully.');
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update user profile. Feature is under maintenance.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex bg-brand-100 text-brand-600 p-3 rounded-full mb-3">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-sm text-slate-500">Manage your account details and role identity.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-2 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start space-x-2 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                disabled
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">System Role</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={user?.role || 'USER'}
                disabled
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md transition"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
