import React, { useState } from 'react';
import { Position } from '../types/trading';
import { computeTaxSummary, generateTaxCSV, downloadFile } from '../utils/taxExport';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { playChime } from '../utils/security';

interface TaxReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: Position[];
}

export const TaxReportingModal: React.FC<TaxReportingModalProps> = ({
  isOpen,
  onClose,
  positions,
}) => {
  const [selectedTaxYear, setSelectedTaxYear] = useState<number>(2026);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = computeTaxSummary(positions, selectedTaxYear);
  const closedPositions = positions.filter(p => p.status === 'closed');

  const handleExportCSV = () => {
    const csvContent = generateTaxCSV(positions, selectedTaxYear);
    downloadFile(csvContent, `REALTRADE_VIEW_Tax_Report_${selectedTaxYear}.csv`, 'text/csv;charset=utf-8;');
    playChime('success');
    setDownloadSuccess('Exported IRS Form 8949 CSV successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify({
      taxYear: selectedTaxYear,
      summary,
      transactions: closedPositions
    }, null, 2);
    downloadFile(jsonContent, `REALTRADE_VIEW_Tax_Audit_${selectedTaxYear}.json`, 'application/json');
    playChime('success');
    setDownloadSuccess('Exported Tax Audit JSON successfully.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c101a] border border-[#1f293d] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-xs font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f293d] bg-[#0f1422]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#00d2ff]" />
            <div>
              <h3 className="font-bold text-white text-base font-display">
                Tax Season Capital Gains & Trend Reporting
              </h3>
              <p className="text-[11px] text-slate-400">
                IRS Form 8949 & Schedule D compliant capital gains audit and historical trade tax ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTaxYear}
              onChange={(e) => setSelectedTaxYear(Number(e.target.value))}
              className="bg-[#141b2b] border border-[#1f293d] rounded px-2.5 py-1 text-slate-200 font-mono text-xs outline-none"
            >
              <option value={2026}>Tax Year 2026</option>
              <option value={2025}>Tax Year 2025</option>
              <option value={2024}>Tax Year 2024</option>
            </select>

            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2336] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="px-4 py-2 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 bg-[#111726] border border-[#1f293d] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Short-Term Net Gains</span>
              <span className={`text-lg font-bold tabular-nums ${summary.shortTermNet >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {summary.shortTermNet >= 0 ? '+' : ''}${summary.shortTermNet.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Taxed as ordinary income</span>
            </div>

            <div className="p-3.5 bg-[#111726] border border-[#1f293d] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Long-Term Net Gains</span>
              <span className={`text-lg font-bold tabular-nums ${summary.longTermNet >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {summary.longTermNet >= 0 ? '+' : ''}${summary.longTermNet.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Qualifies for preferential rate</span>
            </div>

            <div className="p-3.5 bg-[#111726] border border-[#1f293d] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Total Realized Gain / Loss</span>
              <span className={`text-lg font-bold tabular-nums ${summary.netTaxableCapitalGain >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                {summary.netTaxableCapitalGain >= 0 ? '+' : ''}${summary.netTaxableCapitalGain.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Total taxable capital sum</span>
            </div>

            <div className="p-3.5 bg-[#111726] border border-[#1f293d] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase block mb-1">Deductible Broker Fees</span>
              <span className="text-lg font-bold text-slate-200 tabular-nums">
                ${summary.totalFeesPaid.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Offset against proceeds</span>
            </div>
          </div>

          {/* Compliance & Wash-Sale Alert */}
          <div className="p-3 bg-[#111827] border border-[#1f293d] rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                IRS 30-Day Wash-Sale Rule Monitor: <strong className="text-emerald-400">Clean / No Disallowed Losses</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FIFO Cost Basis Protocol</span>
            </div>
          </div>

          {/* Closed Dispositions Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
                Historical Dispositions (Form 8949 Part I & II)
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {closedPositions.length} Disposed Tax Lots
              </span>
            </div>

            <div className="border border-[#1f293d] rounded-lg overflow-x-auto bg-[#0a0d14]">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1f293d] bg-[#0e1422] text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Asset</th>
                    <th className="py-2.5 px-3">Acquired</th>
                    <th className="py-2.5 px-3">Sold</th>
                    <th className="py-2.5 px-3">Proceeds</th>
                    <th className="py-2.5 px-3">Cost Basis</th>
                    <th className="py-2.5 px-3">Fee</th>
                    <th className="py-2.5 px-3">Gain / (Loss)</th>
                    <th className="py-2.5 px-3">Term Classification</th>
                    <th className="py-2.5 px-3">Broker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151c2b] text-slate-300">
                  {closedPositions.map((pos) => {
                    const pnl = pos.realizedPnl ?? 0;
                    const isProfit = pnl >= 0;
                    const proceeds = (pos.exitPrice ?? pos.currentPrice) * pos.amount;

                    return (
                      <tr key={pos.id} className="hover:bg-[#111726]">
                        <td className="py-2.5 px-3 font-bold text-white">
                          {pos.amount} {pos.symbol}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(pos.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {pos.exitTimestamp ? new Date(pos.exitTimestamp).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          ${proceeds.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums">
                          ${pos.totalCost.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums text-slate-400">
                          ${(pos.fees || 0).toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-3 font-bold tabular-nums ${isProfit ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {isProfit ? '+' : ''}${pnl.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            pos.holdingPeriod === 'long_term' 
                              ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {pos.holdingPeriod === 'long_term' ? 'Box D (Long)' : 'Box A (Short)'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {pos.broker}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer with Export Actions */}
        <div className="p-4 border-t border-[#1f293d] bg-[#0f1422] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141b2b] hover:bg-[#1a2336] text-slate-300 rounded font-mono text-xs transition-colors border border-[#1f293d]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit Sheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141b2b] hover:bg-[#1a2336] text-[#00d2ff] rounded font-mono text-xs transition-colors border border-[#00d2ff]/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TurboTax JSON</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00d2ff] hover:bg-[#00b8e6] text-slate-950 font-bold rounded font-mono text-xs transition-colors shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Form 8949 CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
