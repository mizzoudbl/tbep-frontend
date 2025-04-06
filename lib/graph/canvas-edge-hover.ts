import type { Settings } from 'sigma/settings';
import type { EdgeAttributes, NodeAttributes } from '../interface';
import { drawRoundRect } from './utils';

export default function drawEdgeHover(
  context: CanvasRenderingContext2D,
  data: EdgeAttributes & { x: number; y: number },
  settings: Settings<NodeAttributes, EdgeAttributes>,
) {
  if (data.hidden) return;
  const size = settings.edgeLabelSize;
  const font = settings.edgeLabelFont;
  const weight = settings.edgeLabelWeight;

  // Draw the edge label with an improved design
  const text = `Score ${data.label || ''}`;
  const textWidth = context.measureText(text).width;
  const textHeight = size;
  const padding = 8;
  const radius = 6;
  const x = data.x + padding;
  const y = data.y + padding;
  const width = textWidth + 2 * padding;
  const height = textHeight + 2 * padding;

  // Add a subtle glow effect
  context.beginPath();
  context.font = `${weight} ${size}px ${font}`;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 3;
  context.shadowBlur = 10;
  context.shadowColor = 'rgba(0, 128, 128, 0.3)';

  // Use solid white background
  context.fillStyle = '#fff';
  drawRoundRect(context, x, y, width, height, radius);
  context.fill();
  // Reset shadow for border
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // Draw border with gradient
  const strokeGradient = context.createLinearGradient(x, y, x, y + height);
  strokeGradient.addColorStop(0, '#20b2aa');
  strokeGradient.addColorStop(1, '#008080');
  context.lineWidth = 2;
  context.strokeStyle = strokeGradient;
  context.stroke();

  // Draw text
  context.fillStyle = settings.edgeLabelColor.color || '#333';
  context.fillText(text, x + padding, y + padding + textHeight * 0.85);
}
