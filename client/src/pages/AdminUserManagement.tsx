import React, { useState } from 'react';
import { ShieldAlert, Users, Trash2 } from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const [users] = useState([
    { id: '1', name: 'Regular User', email: 'user@example.com', role: 'USER', isActive: true },
    { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', isActive: true },
    { id: '3', name: 'Deactivated Tech', email: 'deactivated@example.com', role: 'USER', isActive: false },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-red-100 text-red-600 p-2.5 rounded-xl">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Review system authorization roles and account activities.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-slate-700">
            <Users className="h-5 w-5" />
            <span className="font-semibold text-sm">Active System Accounts ({users.length})</span>
          </div>
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md font-semibold">
            ReadOnly Panel (Stub)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User Details</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">System Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'text-red-700 bg-red-50' : 'text-slate-700 bg-slate-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.isActive ? 'text-green-700 bg-green-50' : 'text-slate-400 bg-slate-50'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => alert('Account deactivation is disabled in evaluation environment.')}
                      className="inline-flex items-center space-x-1 text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Deactivate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
