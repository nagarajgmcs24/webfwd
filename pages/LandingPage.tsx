
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-2/3">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Empower Your <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Community</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Join Fix-My-Ward to report issues, track progress, and communicate directly with your local representatives. 
              Together, we make our neighborhoods better places to live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center">
                Member Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-full h-full pointer-events-none opacity-10">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="#4F46E5" d="M47.5,-53.4C61.4,-44.7,72.4,-29.4,75.3,-12.9C78.2,3.6,73.1,21.3,62.7,35.4C52.2,49.5,36.4,60,19.3,64.3C2.1,68.6,-16.3,66.8,-32.4,59.3C-48.4,51.8,-62.1,38.6,-68.8,22.4C-75.5,6.2,-75.3,-13,-66.8,-28.3C-58.4,-43.5,-41.7,-54.9,-25.6,-61.8C-9.5,-68.8,6.1,-71.4,21.9,-69.1C37.7,-66.8,47.5,-53.4,47.5,-53.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">2.4k+</div>
              <div className="text-slate-500 font-medium">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">15</div>
              <div className="text-slate-500 font-medium">Active Wards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">4.8k</div>
              <div className="text-slate-500 font-medium">Registered Citizens</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-1">98%</div>
              <div className="text-slate-500 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our platform streamlines the communication between you and your councillor, ensuring every problem is heard and addressed.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Report Issues",
                desc: "Snap a photo and describe the problem. Our AI helps categorize it instantly.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                title: "Track Progress",
                desc: "Get real-time updates as your councillor reviews, initiates, and resolves the issue.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Better Neighborhoods",
                desc: "Data-driven insights help local governments prioritize high-impact community projects.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl">
                <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
