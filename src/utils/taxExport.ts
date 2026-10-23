import { Position } from '../types/trading';

export interface TaxReportSummary {
  taxYear: number;
  totalTrades: number;
  shortTermGain: number;
  shortTermLoss: number;
  shortTermNet: number;
  longTermGain: number;
  longTermLoss: number;
  longTermNet: number;
  totalFeesPaid: number;
  netTaxableCapitalGain: number;
}

export function computeTaxSummary(positions: Position[], taxYear = new Date().getFullYear()): TaxReportSummary {
  const closed = positions.filter(p => p.status === 'closed' && (p.taxYear === taxYear || !p.taxYear));
  
  let shortTermGain = 0;
  let shortTermLoss = 0;
  let longTermGain = 0;
  let longTermLoss = 0;
  let totalFeesPaid = 0;

  for (const pos of closed) {
    const pnl = pos.realizedPnl ?? 0;
    const fee = pos.fees ?? 0;
    totalFeesPaid += fee;

    if (pos.holdingPeriod === 'long_term') {
      if (pnl >= 0) {
        longTermGain += pnl;
      } else {
        longTermLoss += Math.abs(pnl);
      }
    } else {
      if (pnl >= 0) {
        shortTermGain += pnl;
      } else {
        shortTermLoss += Math.abs(pnl);
      }
    }
  }

  const shortTermNet = shortTermGain - shortTermLoss;
  const longTermNet = longTermGain - longTermLoss;
  const netTaxableCapitalGain = shortTermNet + longTermNet;

  return {
    taxYear,
    totalTrades: closed.length,
    shortTermGain,
    shortTermLoss,
    shortTermNet,
    longTermGain,
    longTermLoss,
    longTermNet,
    totalFeesPaid,
    netTaxableCapitalGain
  };
}

/**
 * Generates an IRS Form 8949 / Schedule D compatible CSV string
 */
export function generateTaxCSV(positions: Position[], taxYear = new Date().getFullYear()): string {
  const closed = positions.filter(p => p.status === 'closed');
  
  const headers = [
    'Description (Qty & Asset)',
    'Date Acquired',
    'Date Sold',
    'Proceeds (Sales Price USD)',
    'Cost Basis (USD)',
    'Broker Fee (USD)',
    'Wash Sale Adjustment',
    'Net Gain or Loss (USD)',
    'Holding Term (Short/Long)',
    'Connected Broker'
  ];

  const rows = closed.map(pos => {
    const dateAcquired = new Date(pos.timestamp).toISOString().split('T')[0];
    const dateSold = pos.exitTimestamp ? new Date(pos.exitTimestamp).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const proceeds = ((pos.exitPrice ?? pos.currentPrice) * pos.amount).toFixed(2);
    const costBasis = (pos.entryPrice * pos.amount).toFixed(2);
    const fee = (pos.fees || 0).toFixed(2);
    const gainLoss = (pos.realizedPnl ?? 0).toFixed(2);
    const term = pos.holdingPeriod === 'long_term' ? 'Long-Term (Box D)' : 'Short-Term (Box A)';
    const desc = `"${pos.amount} shares of ${pos.symbol}"`;
    const wash = '0.00';
    const broker = `"${pos.broker}"`;

    return [
      desc,
      dateAcquired,
      dateSold,
      proceeds,
      costBasis,
      fee,
      wash,
      gainLoss,
      term,
      broker
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Trigger browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
