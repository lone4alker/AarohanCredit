import React from 'react';

// --- HELPER: HEADER INFO BLOCK ---
const HeaderBlock = ({ label, value, align = 'left', color = 'gray' }) => (
  <div className={`text-${align}`}>
    <p className={`text-[10px] text-gray-500 uppercase tracking-wider font-semibold`}>{label}</p>
    <p className={`font-bold text-${color}-900 ${color === 'emerald' ? 'text-emerald-600 text-xl' : 'text-sm'}`}>
      {value}
    </p>
  </div>
);

// --- HELPER: TABLE ROW ---
const TableRow = ({ label, current, prior, isTotal = false }) => (
  <tr className={`border-b border-gray-200 ${isTotal ? 'bg-gray-100 font-bold border-t-2 border-gray-400' : ''}`}>
    <td className={`py-1.5 px-4 text-xs ${isTotal ? '' : 'pl-8'}`}>{label}</td>
    <td className="py-1.5 px-4 text-right font-mono text-xs text-gray-800">{current}</td>
    <td className="py-1.5 px-4 text-right font-mono text-xs text-gray-500">{prior}</td>
  </tr>
);

// --- HELPER: TABLE SECTION ---
const TableSection = ({ title, rows, total }) => (
  <div className="mb-6 break-inside-avoid">
    <div className="bg-[#1f497d] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
      {title}
    </div>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#ddebf7] text-[#1f497d] text-[10px] font-bold uppercase border-b border-gray-400">
          <th className="py-2 px-4 text-left w-1/2">Parameter</th>
          <th className="py-2 px-4 text-right">Current Yr (₹)</th>
          <th className="py-2 px-4 text-right">Prior Yr (₹)</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 bg-white">
        {rows.map((row, idx) => (
          <TableRow key={idx} {...row} />
        ))}
        {total && <TableRow label={total.label} current={total.current} prior={total.prior} isTotal />}
      </tbody>
    </table>
  </div>
);

const ReportFormal = ({ data }) => {
  const { meta, banking, scores } = data;

  // Static Rows for "Balance Sheet" look (Populated with passed data where applicable)
  const assetRows = [
    { label: "Cash & Equivalents", current: "25,000.00", prior: "18,000.00" },
    { label: "Accounts Receivable", current: "50,000.00", prior: "45,000.00" },
    { label: "Inventory", current: "30,000.00", prior: "15,000.00" },
    { label: "Short Term Investments", current: "15,000.00", prior: "12,000.00" },
  ];

  const bankingMetrics = [
    { label: "Avg Monthly Balance (AMB)", current: `₹ ${banking.amb.toLocaleString()}`, prior: "₹ 1,10,000" },
    { label: "Total Inflows (L12M)", current: `₹ ${(banking.totalInflow/100000).toFixed(2)} L`, prior: "₹ 16.20 L" },
    { label: "Cheque Bounces", current: banking.bounces.toString(), prior: "1" },
  ];

  return (
    <div className="bg-white max-w-[210mm] mx-auto p-12 shadow-2xl print:shadow-none print:p-0 text-gray-800 font-sans animate-fade-in">
      
      {/* HEADER */}
      <div className="border-b-4 border-[#1f497d] pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1f497d] uppercase tracking-tight">{meta.msmeName}</h1>
          <p className="text-xs font-bold text-gray-600 mt-1 uppercase">Balance Sheet & Credit Assessment</p>
          <div className="text-[10px] text-gray-500 mt-2 space-y-0.5">
            <p>GSTIN: {meta.gstin}</p>
            <p>{meta.address}</p>
          </div>
        </div>
        <div className="text-right">
           {/* Placeholder for Client Logo */}
           <div className="text-2xl font-bold text-gray-200 mb-1">LOGO</div>
           <p className="text-[10px] text-gray-400">Report ID: {meta.id}</p>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <HeaderBlock label="Generated On" value={meta.date} />
        <HeaderBlock label="Period" value="L12M (Nov-Oct)" />
        <HeaderBlock label="Risk Band" value="Low Risk" />
        <HeaderBlock label="Credit Score" value={`${scores.behavioral}/900`} align="right" color="emerald" />
      </div>

      {/* TABLES LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
        <TableSection 
          title="Assets (Current)" 
          rows={assetRows} 
          total={{ label: "TOTAL CURRENT ASSETS", current: "1,20,000.00", prior: "90,000.00" }} 
        />
        <TableSection 
          title="Liabilities (Current)" 
          rows={[
             { label: "Accounts Payable", current: "5,000.00", prior: "4,500.00" },
             { label: "Short Term Loans", current: "12,500.00", prior: "8,500.00" },
             { label: "Accrued Expenses", current: "85,000.00", prior: "70,000.00" },
             { label: "Tax Payable", current: "18,500.00", prior: "15,000.00" },
          ]}
          total={{ label: "TOTAL CURRENT LIABILITIES", current: "1,21,000.00", prior: "98,000.00" }} 
        />
      </div>

      <TableSection 
        title="Banking Performance Indicators (Verified via AA)" 
        rows={bankingMetrics} 
        total={{ label: "LIQUIDITY SCORE", current: "85/100", prior: "78/100" }} 
      />

      {/* FOOTER */}
      <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between text-[8px] text-gray-400 uppercase">
        <span>Generated by CrediFlow Agentic AI</span>
        <span>Strictly Confidential</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
};

export default ReportFormal;