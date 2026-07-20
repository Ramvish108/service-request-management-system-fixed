import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
          <Sparkles className="h-4 w-4 text-brand-600 animate-pulse" />
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
            AI-Assisted Operations
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
          Service Request <br />
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            Management System
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
          Raise hardware, software, network, and access support tickets instantly. Powered by intelligent AI analysis to categorize and suggest priorities for lightning-fast resolutions.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-lg shadow-brand-500/20 transition-all hover:-translate-y-0.5"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/register"
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl text-base font-semibold shadow-sm transition"
          >
            <span>Create Account</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="bg-brand-50 p-3 rounded-xl text-brand-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">AI-Powered Suggestions</h3>
            <p className="text-xs text-slate-500">
              Get instant, advisory summaries and suggested priority ratings for your support tickets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Effortless Tracking</h3>
            <p className="text-xs text-slate-500">
              Monitor real-time ticket status updates and review historical progress step-by-step.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Granular Controls</h3>
            <p className="text-xs text-slate-500">
              Role-based dashboards and admin panels tailored specifically for staff and administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
