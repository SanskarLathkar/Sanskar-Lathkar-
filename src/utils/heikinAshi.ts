import { Candle } from '../types/trading';

/**
 * Calculates Heikin-Ashi candlestick transformations
 */
export function calculateHeikinAshi(candles: Candle[]): Candle[] {
  if (candles.length === 0) return [];

  const haCandles: Candle[] = [];
  let prevHaOpen = candles[0].open;
  let prevHaClose = candles[0].close;

  candles.forEach((c, idx) => {
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    const haOpen = idx === 0 
      ? (c.open + c.close) / 2 
      : (prevHaOpen + prevHaClose) / 2;
    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    haCandles.push({
      timestamp: c.timestamp,
      open: Number(haOpen.toFixed(2)),
      high: Number(haHigh.toFixed(2)),
      low: Number(haLow.toFixed(2)),
      close: Number(haClose.toFixed(2)),
      volume: c.volume
    });

    prevHaOpen = haOpen;
    prevHaClose = haClose;
  });

  return haCandles;
}

export interface VolumeProfileBucket {
  price: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  isPOC: boolean; // Point of Control (highest volume price level)
  isVA: boolean;  // Inside Value Area (70% of total volume)
}

/**
 * Calculates Volume Profile (horizontal volume distribution across price levels)
 */
export function calculateVolumeProfile(candles: Candle[], bucketsCount = 24): {
  buckets: VolumeProfileBucket[];
  pocPrice: number;
  vahPrice: number; // Value Area High
  valPrice: number; // Value Area Low
} {
  if (candles.length === 0) {
    return { buckets: [], pocPrice: 0, vahPrice: 0, valPrice: 0 };
  }

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let totalVolume = 0;

  candles.forEach(c => {
    minPrice = Math.min(minPrice, c.low);
    maxPrice = Math.max(maxPrice, c.high);
    totalVolume += c.volume;
  });

  const range = (maxPrice - minPrice) || 1;
  const step = range / bucketsCount;

  const buckets: VolumeProfileBucket[] = [];
  for (let i = 0; i < bucketsCount; i++) {
    buckets.push({
      price: minPrice + (i + 0.5) * step,
      volume: 0,
      buyVolume: 0,
      sellVolume: 0,
      isPOC: false,
      isVA: false
    });
  }

  // Aggregate volume into price levels
  candles.forEach(c => {
    const isUp = c.close >= c.open;
    const avgPrice = (c.high + c.low + c.close) / 3;
    const bIdx = Math.max(0, Math.min(bucketsCount - 1, Math.floor((avgPrice - minPrice) / step)));
    
    buckets[bIdx].volume += c.volume;
    if (isUp) {
      buckets[bIdx].buyVolume += c.volume * 0.6;
      buckets[bIdx].sellVolume += c.volume * 0.4;
    } else {
      buckets[bIdx].sellVolume += c.volume * 0.6;
      buckets[bIdx].buyVolume += c.volume * 0.4;
    }
  });

  // Find POC (Point of Control)
  let maxBucketVol = 0;
  let pocIdx = 0;
  buckets.forEach((b, idx) => {
    if (b.volume > maxBucketVol) {
      maxBucketVol = b.volume;
      pocIdx = idx;
    }
  });
  buckets[pocIdx].isPOC = true;
  const pocPrice = buckets[pocIdx].price;

  // Calculate Value Area (70% of volume around POC)
  const sortedByVol = [...buckets].sort((a, b) => b.volume - a.volume);
  let vaVol = 0;
  const targetVaVol = totalVolume * 0.7;
  const vaPrices: number[] = [];

  for (const b of sortedByVol) {
    vaVol += b.volume;
    b.isVA = true;
    vaPrices.push(b.price);
    if (vaVol >= targetVaVol) break;
  }

  const vahPrice = vaPrices.length > 0 ? Math.max(...vaPrices) : pocPrice;
  const valPrice = vaPrices.length > 0 ? Math.min(...vaPrices) : pocPrice;

  return { buckets, pocPrice, vahPrice, valPrice };
}
