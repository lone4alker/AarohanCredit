import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Layout, 
  FileText, 
  Clock,
  ArrowRight
} from 'lucide-react';
import ReportInteractive from './Reports/InteractiveView';
import ReportFormal from './Reports/FormalView';

// --- MOCK DATA: LIST OF REPORTS ---
const REPORT_HISTORY = [
  { id: 'RPT-2025-10', date: 'Oct 24, 2025', type: 'Full Sync', score: 780, status: 'Excellent', trigger: 'User Manual Sync' },
  { id: 'RPT-2025-09', date: 'Sep 01, 2025', type: 'Auto-Fetch', score: 765, status: 'Good', trigger: 'Monthly Schedule' },
  { id: 'RPT-2025-08', date: 'Aug 01, 2025', type: 'Auto-Fetch', score: 750, status: 'Good', trigger: 'Monthly Schedule' },
];

// --- MOCK DATA: DETAILED REPORT CONTENT ---
// In a real app, this would be fetched from backend based on the ID selected
const REPORT_DETAIL_DATA = {
  meta: {
    id: 'RPT-2025-10',
    date: 'Oct 24, 2025',
    generatedBy: 'CrediFlow AI Agent',
    msmeName: 'RAJESH ENTERPRISES',
    gstin: '27AAAAA0000A1Z5',
    address: 'Unit 402, Solaris Industrial Park, Andheri East, Mumbai - 400072'
  },
  scores: {
    behavioral: 780,
    financialHealth: 82,
    businessStability: 75
  },
  banking: {
    amb: 125000,
    totalInflow: 1850000, 
    totalOutflow: 1450000,
    bounces: 0,
    lowBalanceDays: 2
  },
  gst: {
    annualTurnover: 19800000,
    filingStatus: 'On-Time',
    b2bRatio: 60,
    inputOutputRatio: 0.85
  }
};

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'formal'

  const handlePrint = () => window.print();

  // --- VIEW 1: REPORT LIST ---
  if (!selectedReport) {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Detailed Reports</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Historical credit assessments and financial health archives.</p>
          </div>
        </div>

        <div className="grid gap-4">
          {REPORT_HISTORY.map((report) => (
            <div 
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="group cursor-pointer bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-6 w-full sm:w-auto">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">{report.date}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center"><Clock size={12} className="mr-1"/> {report.type}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>Trigger: {report.trigger}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-8">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Behavioral Score</p>
                  <p className="text-2xl font-bold text-emerald-500">{report.score}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {report.status}
                  </span>
                </div>
                <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: DETAILED REPORT WRAPPER ---
  return (
    <div className="animate-fade-in space-y-6 pb-10">
      
      {/* ACTION BAR (Hidden on Print) */}
      <div className="flex flex-col md:flex-row items-center justify-between sticky top-0 bg-gray-100/95 dark:bg-[#111217]/95 backdrop-blur-md py-4 z-40 print:hidden border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={() => setSelectedReport(null)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          {/* VIEW MODE TOGGLE */}
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex items-center shadow-sm">
            <button 
              onClick={() => setViewMode('interactive')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'interactive' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Layout size={16} />
              <span>Interactive</span>
            </button>
            <button 
              onClick={() => setViewMode('formal')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'formal' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <FileText size={16} />
              <span>Formal</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0 w-full md:w-auto">
          <button 
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Printer size={16} /><span>Print / PDF</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            <Download size={16} /><span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* RENDER SELECTED VIEW */}
      <div className="min-h-screen">
        {viewMode === 'interactive' ? (
          <ReportInteractive data={REPORT_DETAIL_DATA} />
        ) : (
          <ReportFormal data={REPORT_DETAIL_DATA} />
        )}
      </div>

    </div>
  );
};

export default Reports;