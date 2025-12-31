
import React, { useState, useEffect } from 'react';
import { User, Issue, IssueStatus, BENGALURU_WARDS } from '../types';
import { MockDB } from '../store';
import { analyzeIssue } from '../services/gemini';

interface CouncillorDashboardProps {
  user: User;
}

const CouncillorDashboard: React.FC<CouncillorDashboardProps> = ({ user }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filter, setFilter] = useState<IssueStatus | 'ALL'>('ALL');

  const wardInfo = BENGALURU_WARDS.find(w => w.id === user.wardId) || BENGALURU_WARDS[0];

  useEffect(() => {
    refreshIssues();
  }, [filter, user.wardId]);

  const refreshIssues = () => {
    let all = MockDB.getIssues().filter(i => i.wardId === user.wardId);
    if (filter !== 'ALL') {
      all = all.filter(i => i.status === filter);
    }
    setIssues(all.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleUpdateStatus = (issue: Issue, status: IssueStatus) => {
    const updated = { ...issue, status };
    MockDB.updateIssue(updated);
    if (selectedIssue?.id === issue.id) {
      setSelectedIssue(updated);
    }
    refreshIssues();
  };

  const handleAIAnalysis = async (issue: Issue) => {
    if (issue.aiAnalysis) return;
    setIsAnalyzing(true);
    const analysis = await analyzeIssue(issue.title, issue.description);
    const updated = { ...issue, aiAnalysis: analysis };
    MockDB.updateIssue(updated);
    setSelectedIssue(updated);
    setIsAnalyzing(false);
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
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Sidebar List */}
      <div className="lg:w-1/3">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Bengaluru</span>
            <span className="text-slate-400 text-xs">Admin Access</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{wardInfo.name}</h1>
          <p className="text-slate-500 font-medium">Councillor: {wardInfo.councillor}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {['ALL', ...Object.values(IssueStatus)].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                filter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="grid gap-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {issues.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">No issues found in your ward</p>
            </div>
          ) : (
            issues.map(issue => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedIssue?.id === issue.id ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-3">
                  {issue.imageUrl && (
                    <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0">
                      <img src={issue.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-slate-900 truncate">{issue.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">by {issue.reportedByName}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="lg:w-2/3">
        {selectedIssue ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-6">
                {selectedIssue.imageUrl && (
                  <div className="w-32 h-32 rounded-xl overflow-hidden shadow-md border-4 border-white">
                    <img src={selectedIssue.imageUrl} className="w-full h-full object-cover" alt="Issue Evidence" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                      {selectedIssue.category}
                    </span>
                    <span className="text-slate-400 text-sm">Issue ID: {selectedIssue.id}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedIssue.title}</h2>
                  <p className="text-slate-500">Reported by <b>{selectedIssue.reportedByName}</b> on {new Date(selectedIssue.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(selectedIssue.status)}`}>
                  {selectedIssue.status}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Issue Description</h3>
                    <div className="bg-slate-50 p-6 rounded-xl text-slate-700 leading-relaxed min-h-[120px]">
                      {selectedIssue.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Update Status</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(IssueStatus).map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedIssue, status)}
                          className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                            selectedIssue.status === status 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insight Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Gemini AI Analysis</h3>
                    {!selectedIssue.aiAnalysis && (
                      <button
                        onClick={() => handleAIAnalysis(selectedIssue)}
                        disabled={isAnalyzing}
                        className="text-xs bg-indigo-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center gap-1"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze with Gemini"}
                      </button>
                    )}
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl min-h-[300px] relative">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                         <div className="animate-pulse bg-indigo-200 h-2 w-3/4 rounded mb-2"></div>
                         <div className="animate-pulse bg-indigo-200 h-2 w-1/2 rounded mb-2"></div>
                         <div className="animate-pulse bg-indigo-200 h-2 w-2/3 rounded"></div>
                      </div>
                    ) : selectedIssue.aiAnalysis ? (
                      <div className="prose prose-sm prose-indigo">
                        <div className="whitespace-pre-wrap text-sm text-indigo-900 leading-relaxed font-medium">
                          {selectedIssue.aiAnalysis}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-indigo-300 text-center py-8">
                        <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-xs font-medium">Click "Analyze with Gemini" to generate insights for this ward issue.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-sm mb-6">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a ward report</h3>
            <p className="text-slate-500 max-w-sm">Manage Bengaluru infrastructure efficiently. Select an issue to see descriptions, citizen photos, and AI-powered recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouncillorDashboard;
