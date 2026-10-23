export type DrawingToolType = 
  | 'cursor' 
  | 'crosshair'
  | 'trendline' 
  | 'horizontal' 
  | 'fibonacci' 
  | 'rectangle' 
  | 'long_position' 
  | 'short_position' 
  | 'measurement'
  | 'brush';

export interface ChartDrawing {
  id: string;
  type: DrawingToolType;
  points: { index: number; price: number; timestamp?: number }[];
  color?: string;
  lineWidth?: number;
  label?: string;
}
