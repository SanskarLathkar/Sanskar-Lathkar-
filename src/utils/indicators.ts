import { Candle } from '../types/trading';

/**
 * Technical Indicator Math Algorithms for financial trading
 */

export function calculateSMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[i - j].close;
      }
      result.push(sum / period);
    }
  }
  return result;
}

export function calculateEMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let previousEMA: number | null = null;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += candles[j].close;
      }
      previousEMA = sum / period;
      result.push(previousEMA);
    } else {
      const currentClose = candles[i].close;
      const currentEMA: number = currentClose * k + (previousEMA as number) * (1 - k);
      previousEMA = currentEMA;
      result.push(currentEMA);
    }
  }
  return result;
}

export interface BollingerBandsResult {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
}

export function calculateBollingerBands(candles: Candle[], period = 20, multiplier = 2): BollingerBandsResult {
  const middle = calculateSMA(candles, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    const ma = middle[i];
    if (ma === null) {
      upper.push(null);
      lower.push(null);
    } else {
      let varianceSum = 0;
      for (let j = 0; j < period; j++) {
        varianceSum += Math.pow(candles[i - j].close - ma, 2);
      }
      const stdDev = Math.sqrt(varianceSum / period);
      upper.push(ma + multiplier * stdDev);
      lower.push(ma - multiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

export function calculateRSI(candles: Candle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  let gains: number[] = [];
  let losses: number[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = candles[i].close - candles[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    gains.push(gain);
    losses.push(loss);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      let avgGain = gains.reduce((acc, val) => acc + val, 0) / period;
      let avgLoss = losses.reduce((acc, val) => acc + val, 0) / period;
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - (100 / (1 + rs)));
      }
    } else {
      // Smoothed averages (Wilder's Smoothing)
      const prevRSI = result[i - 1] ?? 50;
      const prevAvgGain = ((prevRSI / (100 - prevRSI)) * (losses[losses.length - 2] || 1)) || 1;
      const currentAvgGain = (prevAvgGain * (period - 1) + gain) / period;
      const currentAvgLoss = (((losses[losses.length - 2] || 1) * (period - 1)) + loss) / period;

      if (currentAvgLoss === 0) {
        result.push(100);
      } else {
        const rs = currentAvgGain / currentAvgLoss;
        result.push(Math.max(0, Math.min(100, 100 - (100 / (1 + rs)))));
      }
    }
  }

  return result;
}

export interface MACDResult {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
}

export function calculateMACD(candles: Candle[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): MACDResult {
  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);
  const macd: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    const fast = fastEMA[i];
    const slow = slowEMA[i];
    if (fast !== null && slow !== null) {
      macd.push(fast - slow);
    } else {
      macd.push(null);
    }
  }

  // Calculate signal line (EMA of MACD line)
  const signal: (number | null)[] = [];
  const k = 2 / (signalPeriod + 1);
  let prevSignal: number | null = null;
  const validMacds: number[] = [];

  for (let i = 0; i < macd.length; i++) {
    const val = macd[i];
    if (val === null) {
      signal.push(null);
    } else {
      validMacds.push(val);
      if (validMacds.length < signalPeriod) {
        signal.push(null);
      } else if (validMacds.length === signalPeriod) {
        const sum = validMacds.reduce((a, b) => a + b, 0);
        prevSignal = sum / signalPeriod;
        signal.push(prevSignal);
      } else {
        prevSignal = val * k + (prevSignal as number) * (1 - k);
        signal.push(prevSignal);
      }
    }
  }

  const histogram: (number | null)[] = [];
  for (let i = 0; i < macd.length; i++) {
    const m = macd[i];
    const s = signal[i];
    if (m !== null && s !== null) {
      histogram.push(m - s);
    } else {
      histogram.push(null);
    }
  }

  return { macd, signal, histogram };
}

export function calculateATR(candles: Candle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const trs: number[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      const tr = candles[0].high - candles[0].low;
      trs.push(tr);
      result.push(null);
      continue;
    }
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trs.push(tr);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const sum = trs.slice(1, period + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    } else {
      const prevATR = result[i - 1] ?? tr;
      const currentATR = (prevATR * (period - 1) + tr) / period;
      result.push(currentATR);
    }
  }
  return result;
}
