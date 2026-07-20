import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ServiceRequest } from '../types';
import { ArrowLeft, Clock, User, AlertTriangle } from 'lucide-react';

export const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);
      } catch (err: any) {
        setError(err.response?.data?.details || 'Error fetching request details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 text-brand-600 border-4 border-t-transparent border-brand-600 rounded-full"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl inline-block max-w-md">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-800 mb-2">Failed to Load Request</h2>
          <p className="text-xs text-red-600 font-mono break-all">{error || 'Request not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-slate-500 hover:text-brand-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to list</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-brand-600 tracking-wider uppercase bg-brand-50 px-2.5 py-1 rounded-md">
                {request.requestNumber}
              </span>
              <span className="text-xs text-slate-400">
                Created: {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-4">{request.title}</h1>
            <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed mb-6">
              {request.description}
            </p>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Category</span>
                <span className="font-semibold text-slate-800">{request.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Priority</span>
                <span className="font-semibold text-slate-800">{request.priority}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Status</span>
                <span className="font-semibold text-slate-800">{request.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <span>Status History Timeline</span>
            </h3>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {request.statusHistory && request.statusHistory.map((history, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== request.statusHistory.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">
                            <Clock className="h-4 w-4 text-slate-500" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-800">
                              Status changed to <span className="font-semibold text-brand-600">{history.status}</span>
                            </p>
                            {history.note && (
                              <p className="text-xs text-slate-500 italic mt-0.5">"{history.note}"</p>
                            )}
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-slate-400">
                            {new Date(history.changedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-slate-500" />
              <span>Stakeholders</span>
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block mb-0.5">Raised By</span>
                <span className="font-semibold text-slate-800">{request.createdBy?.name || 'Unknown'}</span>
                <span className="text-xs text-slate-500 block">{request.createdBy?.email || 'N/A'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block mb-0.5">Assigned Agent</span>
                <span className="font-semibold text-slate-800">{request.assignedTo?.name || 'Unassigned'}</span>
                <span className="text-xs text-slate-500 block">{request.assignedTo?.email || ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
