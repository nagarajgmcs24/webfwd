
import React, { useState, useEffect, useRef } from 'react';
import { User, Issue, IssueStatus, IssueCategory, BENGALURU_WARDS } from '../types';
import { MockDB } from '../store';
import { analyzeIssue, categorizeIssueAuto } from '../services/gemini';

interface CitizenDashboardProps {
  user: User;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: IssueCategory.OTHER,
  });

  const wardInfo = BENGALURU_WARDS.find(w => w.id === user.wardId) || BENGALURU_WARDS[0];

  useEffect(() => {
    refreshIssues();
  }, []);

  const refreshIssues = () => {
    const all = MockDB.getIssues();
    setIssues(all.filter(i => i.reportedBy === user.id).sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalCategory = newIssue.category;
    if (newIssue.description.length > 10) {
      const suggested = await categorizeIssueAuto(newIssue.description);
      if (Object.values(IssueCategory).includes(suggested as IssueCategory)) {
        finalCategory = suggested as IssueCategory;
      }
    }

    const issue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      title: newIssue.title,
      description: newIssue.description,
      category: finalCategory,
      status: IssueStatus.PENDING,
      reportedBy: user.id,
      reportedByName: user.name,
      wardId: user.wardId,
      wardName: wardInfo.name,
      councillorName: wardInfo.councillor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageUrl: imagePreview || undefined
    };

    MockDB.saveIssue(issue);
    setIsSubmitting(false);
    setIsReporting(false);
    setImagePreview(null);
    setNewIssue({ title: '', description: '', category: IssueCategory.OTHER });
    refreshIssues();
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.PENDING: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case IssueStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
      case IssueStatus.RESOLVED: return 'bg-green-100 text-green-700 border-green-200';
      case IssueStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500">
            Ward: <span className="font-semibold text-slate-700">{wardInfo.name}</span> • 
            Councillor: <span className="font-semibold text-slate-700">{wardInfo.councillor}</span>
          </p>
        </div>
        <button
          onClick={() => setIsReporting(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Report New Issue
        </button>
      </div>

      {isReporting && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">New Issue Report</h2>
              <button onClick={() => setIsReporting(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleReportIssue} className="p-8 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ward Information</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{wardInfo.name}</span>
                  <span className="font-semibold text-indigo-600">{wardInfo.councillor}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Large pothole on Oak Street"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newIssue.title}
                  onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl aspect-video flex flex-col items-center justify-center hover:bg-slate-50 hover:border-indigo-300 transition-all overflow-hidden"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="bg-indigo-50 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-500">Click to upload photo</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  {imagePreview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white font-bold">Change Photo</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newIssue.category}
                    onChange={e => setNewIssue({ ...newIssue, category: e.target.value as IssueCategory })}
                  >
                    {Object.values(IssueCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ward ID</label>
                  <input
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
                    value={user.wardId}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about the issue location and severity..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newIssue.description}
                  onChange={e => setNewIssue({ ...newIssue, description: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsReporting(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {issues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No reports yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">You haven't reported any issues in your ward. Help improve your community by starting your first report.</p>
          <button
            onClick={() => setIsReporting(true)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Report your first issue &rarr;
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {issues.map(issue => (
            <div key={issue.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-grow flex gap-4">
                {issue.imageUrl && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Issue" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-slate-400">{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{issue.title}</h3>
                  <p className="text-slate-600 line-clamp-2 max-w-2xl">{issue.description}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded">{issue.category}</span>
                    <span className="text-indigo-600">Councillor: {issue.councillorName}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px]">
                <button className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 py-2 px-4 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
